import { Awards } from "./award"

/**
 * Example component demonstrating the Certificate variant of the Awards component
 * This is how to use the Awards component in your certification section
 */
export function CertificateExample() {
  return (
    <Awards
      variant="certificate"
      title="Appreciation"
      subtitle="has successfully completed the mastery of design."
      recipient="Ali Imam"
      date="June 2025"
    />
  )
}

/**
 * Example component demonstrating the Badge variant
 */
export function BadgeExample() {
  return (
    <Awards
      variant="badge"
      title="AWS Certified"
      subtitle="Cloud Architect Professional"
      recipient="Amazon Web Services"
      date="March 2024"
    />
  )
}

/**
 * Example component demonstrating the Award variant
 */
export function AwardExample() {
  return (
    <Awards
      variant="award"
      title="Excellence in Innovation"
      subtitle="For outstanding contributions"
      recipient="Tech Summit 2024"
      date="November 2024"
      level="gold"
    />
  )
}

/**
 * Example component demonstrating the Stamp variant
 */
export function StampExample() {
  return (
    <Awards
      variant="stamp"
      title="APPROVED"
      subtitle="VERIFIED"
      recipient="Quality Verified"
      date="2024"
    />
  )
}

/**
 * Example component demonstrating the ID Card variant
 */
export function IdCardExample() {
  return (
    <Awards
      variant="id-card"
      title="Professional Recognition"
      subtitle="Digital Badge"
      description="Advanced Developer"
      date="2024-2025"
    />
  )
}

/**
 * Demo component showcasing all variants
 */
export default function AwardsDemo() {
  return (
    <div className="space-y-8 p-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Certificate Variant</h2>
        <CertificateExample />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Badge Variant</h2>
        <BadgeExample />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Award Variant</h2>
        <AwardExample />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Stamp Variant</h2>
        <StampExample />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">ID Card Variant</h2>
        <IdCardExample />
      </section>
    </div>
  )
}
