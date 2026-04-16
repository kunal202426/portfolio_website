import {
  createContext,
  forwardRef,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
import { debounce } from 'lodash'
import * as decomp from 'poly-decomp'
import Matter, {
  Body,
  Bodies,
  Common,
  Engine,
  Mouse,
  MouseConstraint,
  Render,
  Runner,
  World,
} from 'matter-js'
import SVGPathCommander from 'svg-path-commander'

import { cn } from '@/lib/utils'

function parsePathToVertices(path: string, sampleLength = 15) {
  const commander = new SVGPathCommander(path)
  const points: { x: number; y: number }[] = []
  let lastPoint: { x: number; y: number } | null = null

  const totalLength = commander.getTotalLength()
  let length = 0

  while (length < totalLength) {
    const point = commander.getPointAtLength(length)

    if (!lastPoint || point.x !== lastPoint.x || point.y !== lastPoint.y) {
      points.push({ x: point.x, y: point.y })
      lastPoint = point
    }

    length += sampleLength
  }

  const finalPoint = commander.getPointAtLength(totalLength)
  if (!lastPoint || finalPoint.x !== lastPoint.x || finalPoint.y !== lastPoint.y) {
    points.push({ x: finalPoint.x, y: finalPoint.y })
  }

  return points
}

function calculatePosition(value: number | string | undefined, containerSize: number, elementSize: number) {
  const min = elementSize / 2
  const max = Math.max(min, containerSize - elementSize / 2)

  if (typeof value === 'string' && value.endsWith('%')) {
    const percentage = Math.min(Math.max(parseFloat(value) / 100, 0), 1)
    return min + (max - min) * percentage
  }

  const fallback = min + (max - min) * 0.5
  const numeric = typeof value === 'number' ? value : fallback
  return Math.min(Math.max(numeric, min), max)
}

function isCoarsePointerDevice() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }

  return window.matchMedia('(pointer: coarse)').matches
}

type GravityProps = {
  children: ReactNode
  debug?: boolean
  gravity?: { x: number; y: number }
  resetOnResize?: boolean
  pauseWhenOffscreen?: boolean
  maxFps?: number
  grabCursor?: boolean
  addTopWall?: boolean
  autoStart?: boolean
  className?: string
}

type MatterBodyProps = {
  children: ReactNode
  matterBodyOptions?: Matter.IBodyDefinition
  isDraggable?: boolean
  bodyType?: 'rectangle' | 'circle' | 'svg'
  sampleLength?: number
  x?: number | string
  y?: number | string
  angle?: number
  className?: string
}

type PhysicsBody = {
  element: HTMLElement
  body: Matter.Body
  width: number
  height: number
  props: MatterBodyProps
}

export type GravityRef = {
  start: () => void
  stop: () => void
  reset: () => void
}

const GravityContext = createContext<{
  registerElement: (id: string, element: HTMLElement, props: MatterBodyProps) => void
  unregisterElement: (id: string) => void
} | null>(null)

const MatterBody = ({
  children,
  className,
  matterBodyOptions = {
    friction: 0.1,
    restitution: 0.1,
    density: 0.001,
    isStatic: false,
  },
  bodyType = 'rectangle',
  isDraggable = true,
  sampleLength = 15,
  x = 0,
  y = 0,
  angle = 0,
}: MatterBodyProps) => {
  const elementRef = useRef<HTMLDivElement>(null)
  const idRef = useRef(Math.random().toString(36).slice(2))
  const context = useContext(GravityContext)

  useEffect(() => {
    if (!elementRef.current || !context) return

    const props: MatterBodyProps = {
      children,
      matterBodyOptions,
      bodyType,
      sampleLength,
      isDraggable,
      x,
      y,
      angle,
      className,
    }

    context.registerElement(idRef.current, elementRef.current, props)

    return () => context.unregisterElement(idRef.current)
  }, [context, children, matterBodyOptions, bodyType, sampleLength, isDraggable, x, y, angle, className])

  return (
    <div
      ref={elementRef}
      className={cn('absolute select-none touch-none', className, isDraggable ? 'pointer-events-auto cursor-grab' : 'pointer-events-none')}
    >
      {children}
    </div>
  )
}

const Gravity = forwardRef<GravityRef, GravityProps>(
  (
    {
      children,
      debug = false,
      gravity = { x: 0, y: 1 },
      grabCursor = true,
      resetOnResize = true,
      pauseWhenOffscreen = true,
      maxFps = 50,
      addTopWall = true,
      autoStart = true,
      className,
      ...props
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLDivElement>(null)
    const engineRef = useRef(Engine.create())
    const renderRef = useRef<Render | null>(null)
    const mouseRef = useRef<Matter.Mouse | null>(null)
    const runnerRef = useRef<Runner | null>(null)
    const mouseConstraintRef = useRef<Matter.MouseConstraint | null>(null)
    const frameIdRef = useRef<number | null>(null)
    const frameIntervalRef = useRef(1000 / Math.max(20, maxFps))
    const lastUiFrameTimeRef = useRef(0)
    const mouseDownRef = useRef(false)
    const isInViewRef = useRef(true)
    const isRunningRef = useRef(false)
    const canvasSizeRef = useRef({ width: 0, height: 0 })
    const bodiesMapRef = useRef(new Map<string, PhysicsBody>())
    const intersectionObserverRef = useRef<IntersectionObserver | null>(null)
    const visibilityHandlerRef = useRef<(() => void) | null>(null)
    const pointerDownHandlerRef = useRef<(() => void) | null>(null)
    const pointerUpHandlerRef = useRef<(() => void) | null>(null)
    const pointerEnterHandlerRef = useRef<(() => void) | null>(null)
    const pointerLeaveHandlerRef = useRef<(() => void) | null>(null)

    useEffect(() => {
      frameIntervalRef.current = 1000 / Math.max(20, maxFps)
    }, [maxFps])

    const updateElements = useCallback((time: number) => {
      if (time - lastUiFrameTimeRef.current < frameIntervalRef.current) {
        frameIdRef.current = requestAnimationFrame(updateElements)
        return
      }

      lastUiFrameTimeRef.current = time

      bodiesMapRef.current.forEach(({ element, body, width, height }) => {
        const { x, y } = body.position
        const rotation = body.angle * (180 / Math.PI)
        element.style.transform = `translate3d(${x - width / 2}px, ${y - height / 2}px, 0) rotate(${rotation}deg)`
      })

      frameIdRef.current = requestAnimationFrame(updateElements)
    }, [])

    const registerElement = useCallback(
      (id: string, element: HTMLElement, bodyProps: MatterBodyProps) => {
        if (!canvasRef.current) return

        const width = Math.max(1, element.offsetWidth)
        const height = Math.max(1, element.offsetHeight)
        const canvasRect = canvasRef.current.getBoundingClientRect()
        const angle = (bodyProps.angle || 0) * (Math.PI / 180)
        const x = calculatePosition(bodyProps.x, canvasRect.width, width)
        const y = calculatePosition(bodyProps.y, canvasRect.height, height)

        const rawBodyOptions = { ...(bodyProps.matterBodyOptions || {}) }
        const { chamfer, ...restBodyOptions } = rawBodyOptions
        const bodyOptions: Matter.IBodyDefinition = chamfer
          ? { ...restBodyOptions, chamfer: chamfer as Matter.IChamfer }
          : restBodyOptions
        const bodyBuildOptions = bodyOptions as unknown as Matter.IChamferableBodyDefinition

        let body: Matter.Body | null = null

        if (bodyProps.bodyType === 'circle') {
          const radius = Math.max(width, height) / 2
          body = Bodies.circle(x, y, radius, {
            ...bodyBuildOptions,
            angle,
            render: {
              fillStyle: debug ? '#777777' : '#00000000',
              strokeStyle: debug ? '#333333' : '#00000000',
              lineWidth: debug ? 2 : 0,
            },
          })
        } else if (bodyProps.bodyType === 'svg') {
          const paths = element.querySelectorAll('path')
          const vertexSets: Matter.Vector[][] = []

          paths.forEach((path) => {
            const d = path.getAttribute('d')
            if (!d) return
            const vertices = parsePathToVertices(d, bodyProps.sampleLength)
            if (vertices.length > 2) {
              vertexSets.push(vertices)
            }
          })

          if (vertexSets.length > 0) {
            const bodyFromVertices = Bodies.fromVertices(x, y, vertexSets, {
              ...bodyBuildOptions,
              angle,
              render: {
                fillStyle: debug ? '#777777' : '#00000000',
                strokeStyle: debug ? '#333333' : '#00000000',
                lineWidth: debug ? 2 : 0,
              },
            })

            body = Array.isArray(bodyFromVertices) ? bodyFromVertices[0] : bodyFromVertices
          }
        }

        if (!body) {
          body = Bodies.rectangle(x, y, width, height, {
            ...bodyBuildOptions,
            angle,
            render: {
              fillStyle: debug ? '#777777' : '#00000000',
              strokeStyle: debug ? '#333333' : '#00000000',
              lineWidth: debug ? 2 : 0,
            },
          })
        }

        World.add(engineRef.current.world, body)
        element.style.willChange = 'transform'
        bodiesMapRef.current.set(id, { element, body, width, height, props: bodyProps })
      },
      [debug]
    )

    const unregisterElement = useCallback((id: string) => {
      const physicsBody = bodiesMapRef.current.get(id)
      if (!physicsBody) return
      World.remove(engineRef.current.world, physicsBody.body)
      bodiesMapRef.current.delete(id)
    }, [])

    const startEngine = useCallback(() => {
      if (isRunningRef.current) return
      if (!runnerRef.current) return
      if (debug && !renderRef.current) return

      Runner.run(runnerRef.current, engineRef.current)
      if (debug) {
        Render.run(renderRef.current as Render)
      }
      frameIdRef.current = requestAnimationFrame(updateElements)
      isRunningRef.current = true
    }, [debug, updateElements])

    const stopEngine = useCallback(() => {
      if (!isRunningRef.current) return

      if (runnerRef.current) {
        Runner.stop(runnerRef.current)
      }
      if (renderRef.current) {
        if (debug) {
          Render.stop(renderRef.current)
        }
      }
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current)
        frameIdRef.current = null
      }
      isRunningRef.current = false
    }, [debug])

    const syncEngineState = useCallback(() => {
      const shouldRun = autoStart && (!pauseWhenOffscreen || isInViewRef.current) && !document.hidden
      if (shouldRun) {
        startEngine()
      } else {
        stopEngine()
      }
    }, [autoStart, pauseWhenOffscreen, startEngine, stopEngine])

    const clearRenderer = useCallback(() => {
      stopEngine()

      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect()
        intersectionObserverRef.current = null
      }
      if (visibilityHandlerRef.current) {
        document.removeEventListener('visibilitychange', visibilityHandlerRef.current)
        visibilityHandlerRef.current = null
      }

      if (canvasRef.current && pointerDownHandlerRef.current) {
        canvasRef.current.removeEventListener('pointerdown', pointerDownHandlerRef.current)
      }
      if (canvasRef.current && pointerEnterHandlerRef.current) {
        canvasRef.current.removeEventListener('pointerenter', pointerEnterHandlerRef.current)
      }
      if (canvasRef.current && pointerLeaveHandlerRef.current) {
        canvasRef.current.removeEventListener('pointerleave', pointerLeaveHandlerRef.current)
      }
      if (pointerUpHandlerRef.current) {
        window.removeEventListener('pointerup', pointerUpHandlerRef.current)
      }
      pointerDownHandlerRef.current = null
      pointerUpHandlerRef.current = null
      pointerEnterHandlerRef.current = null
      pointerLeaveHandlerRef.current = null

      if (mouseConstraintRef.current) {
        World.remove(engineRef.current.world, mouseConstraintRef.current)
      }

      if (mouseRef.current) {
        Mouse.clearSourceEvents(mouseRef.current)
      }

      if (renderRef.current) {
        renderRef.current.canvas.remove()
      }

      World.clear(engineRef.current.world, false)
      Engine.clear(engineRef.current)
      bodiesMapRef.current.clear()
      mouseConstraintRef.current = null
      mouseRef.current = null
      renderRef.current = null
      runnerRef.current = null
    }, [stopEngine])

    const initializeRenderer = useCallback(() => {
      if (!canvasRef.current) return

      const coarsePointer = isCoarsePointerDevice()

      const width = canvasRef.current.offsetWidth
      const height = canvasRef.current.offsetHeight
      if (!width || !height) return

      canvasSizeRef.current = { width, height }

      ;(Common as unknown as { setDecomp: (decomposition: unknown) => void }).setDecomp(decomp)

      engineRef.current.gravity.x = gravity.x
      engineRef.current.gravity.y = gravity.y
        engineRef.current.positionIterations = coarsePointer ? 4 : 6
        engineRef.current.velocityIterations = coarsePointer ? 3 : 4
        engineRef.current.constraintIterations = coarsePointer ? 1 : 2

      const mouse = Mouse.create(canvasRef.current)
      mouseRef.current = mouse

      if (debug) {
        renderRef.current = Render.create({
          element: canvasRef.current,
          engine: engineRef.current,
          options: {
            width,
            height,
            wireframes: false,
            background: '#00000000',
            pixelRatio: coarsePointer ? 1 : Math.min(window.devicePixelRatio || 1, 1.25),
          },
        })

        // Keep renderer transparent and non-interactive so drag input can be read from the container.
        renderRef.current.canvas.style.pointerEvents = 'none'
        renderRef.current.canvas.style.position = 'absolute'
        renderRef.current.canvas.style.inset = '0'
      }

      mouseConstraintRef.current = MouseConstraint.create(engineRef.current, {
        mouse,
        constraint: {
          stiffness: coarsePointer ? 0.14 : 0.2,
          render: {
            visible: debug,
          },
        },
      })

      const walls: Matter.Body[] = [
        Bodies.rectangle(width / 2, height + 12, width + 24, 24, {
          isStatic: true,
          friction: 1,
          render: { visible: debug },
        }),
        Bodies.rectangle(width + 12, height / 2, 24, height + 24, {
          isStatic: true,
          friction: 1,
          render: { visible: debug },
        }),
        Bodies.rectangle(-12, height / 2, 24, height + 24, {
          isStatic: true,
          friction: 1,
          render: { visible: debug },
        }),
      ]

      if (addTopWall) {
        walls.push(
          Bodies.rectangle(width / 2, -12, width + 24, 24, {
            isStatic: true,
            friction: 1,
            render: { visible: debug },
          })
        )
      }

      World.add(engineRef.current.world, [mouseConstraintRef.current, ...walls])

      if (renderRef.current) {
        renderRef.current.mouse = mouse
      }

      runnerRef.current = Runner.create()

      if (grabCursor && canvasRef.current) {
        canvasRef.current.style.cursor = 'grab'

        pointerDownHandlerRef.current = () => {
          mouseDownRef.current = true
          if (canvasRef.current) {
            canvasRef.current.style.cursor = 'grabbing'
          }
        }

        pointerUpHandlerRef.current = () => {
          mouseDownRef.current = false
          if (canvasRef.current) {
            canvasRef.current.style.cursor = 'grab'
          }
        }

        pointerEnterHandlerRef.current = () => {
          if (!mouseDownRef.current && canvasRef.current) {
            canvasRef.current.style.cursor = 'grab'
          }
        }

        pointerLeaveHandlerRef.current = () => {
          if (!mouseDownRef.current && canvasRef.current) {
            canvasRef.current.style.cursor = 'default'
          }
        }

        canvasRef.current.addEventListener('pointerdown', pointerDownHandlerRef.current)
        canvasRef.current.addEventListener('pointerenter', pointerEnterHandlerRef.current)
        canvasRef.current.addEventListener('pointerleave', pointerLeaveHandlerRef.current)
        window.addEventListener('pointerup', pointerUpHandlerRef.current)
      }

      if (pauseWhenOffscreen && canvasRef.current) {
        intersectionObserverRef.current = new IntersectionObserver(
          (entries) => {
            const [entry] = entries
            isInViewRef.current = Boolean(entry?.isIntersecting)
            syncEngineState()
          },
          { root: null, rootMargin: '200px 0px', threshold: 0.01 }
        )
        intersectionObserverRef.current.observe(canvasRef.current)
      }

      visibilityHandlerRef.current = () => {
        syncEngineState()
      }
      document.addEventListener('visibilitychange', visibilityHandlerRef.current)

      if (autoStart) {
        syncEngineState()
      }
    }, [addTopWall, autoStart, debug, grabCursor, gravity.x, gravity.y, pauseWhenOffscreen, syncEngineState])

    const handleResize = useCallback(() => {
      if (!resetOnResize || !canvasRef.current) return
      clearRenderer()
      initializeRenderer()
    }, [clearRenderer, initializeRenderer, resetOnResize])

    const reset = useCallback(() => {
      bodiesMapRef.current.forEach(({ element, body, props: bodyProps }) => {
        const nextX = calculatePosition(bodyProps.x, canvasSizeRef.current.width, element.offsetWidth)
        const nextY = calculatePosition(bodyProps.y, canvasSizeRef.current.height, element.offsetHeight)
        body.angle = (bodyProps.angle || 0) * (Math.PI / 180)
        body.position.x = nextX
        body.position.y = nextY
        Body.setVelocity(body, { x: 0, y: 0 })
        Body.setAngularVelocity(body, 0)
      })
      updateElements(performance.now())
    }, [updateElements])

    useImperativeHandle(
      ref,
      () => ({
        start: startEngine,
        stop: stopEngine,
        reset,
      }),
      [reset, startEngine, stopEngine]
    )

    useEffect(() => {
      initializeRenderer()
      return clearRenderer
    }, [initializeRenderer, clearRenderer])

    useEffect(() => {
      if (!resetOnResize) return

      const debouncedResize = debounce(handleResize, 350)
      window.addEventListener('resize', debouncedResize)

      return () => {
        window.removeEventListener('resize', debouncedResize)
        debouncedResize.cancel()
      }
    }, [handleResize, resetOnResize])

    return (
      <GravityContext.Provider value={{ registerElement, unregisterElement }}>
        <div ref={canvasRef} className={cn(className, 'absolute inset-0 pointer-events-auto touch-none')} {...props}>
          {children}
        </div>
      </GravityContext.Provider>
    )
  }
)

Gravity.displayName = 'Gravity'

export { Gravity, MatterBody }
