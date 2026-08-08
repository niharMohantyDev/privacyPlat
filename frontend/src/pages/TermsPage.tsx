import { Link } from 'react-router-dom'

import { LegalPageLayout, LegalSection } from '@/components/marketing/LegalPageLayout'
import { APP_NAME } from '@/lib/brand'

export function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="August 8, 2026">
      <LegalSection heading="1. Acceptance of Terms">
        <p>
          These Terms of Service ("Terms") govern access to and use of {APP_NAME} (the "Service"),
          provided by {APP_NAME}, Inc. ("{APP_NAME}", "we", "us"). By creating an account or
          otherwise using the Service, you agree to be bound by these Terms. If you are using the
          Service on behalf of an organization, you represent that you have authority to bind that
          organization.
        </p>
      </LegalSection>

      <LegalSection heading="2. Description of Service">
        <p>
          {APP_NAME} provides tools for consent management, data-subject rights fulfillment, and
          related privacy operations, including the embeddable consent and rights components and
          the staff administration console. We may add, change, or remove features at any time.
        </p>
      </LegalSection>

      <LegalSection heading="3. Accounts &amp; Security">
        <p>
          You are responsible for maintaining the confidentiality of your account credentials and
          for all activity under your account. Notify us promptly of any unauthorized use. We are
          not liable for losses arising from your failure to safeguard your credentials.
        </p>
      </LegalSection>

      <LegalSection heading="4. Acceptable Use">
        <p>You agree not to, and not to permit others to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Use the Service to violate any applicable law or a third party's rights;</li>
          <li>Attempt to gain unauthorized access to the Service or its underlying systems;</li>
          <li>Interfere with or disrupt the integrity or performance of the Service;</li>
          <li>Reverse engineer or attempt to extract the source code of the Service, except as permitted by law.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="5. Customer Data &amp; Processing">
        <p>
          As between the parties, you retain all rights to the data you submit to the Service,
          including consent records and data-subject requests ("Customer Data"). You grant us a
          license to process Customer Data solely to provide and improve the Service. Our handling
          of personal data is described in our{' '}
          <Link to="/privacy" className="text-indigo-600 hover:underline dark:text-indigo-400">
            Privacy Policy
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection heading="6. Intellectual Property">
        <p>
          The Service, including its software, design, and trademarks, is owned by {APP_NAME} or
          its licensors and is protected by intellectual property laws. These Terms do not grant
          you any rights to our trademarks or branding.
        </p>
      </LegalSection>

      <LegalSection heading="7. Termination">
        <p>
          Either party may terminate access to the Service as agreed in an applicable order form,
          or, absent one, with 30 days' written notice. We may suspend access immediately for a
          material breach of these Terms, including a violation of Section 4.
        </p>
      </LegalSection>

      <LegalSection heading="8. Disclaimer of Warranties">
        <p>
          THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED,
          OR STATUTORY, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
          OR NON-INFRINGEMENT.
        </p>
      </LegalSection>

      <LegalSection heading="9. Limitation of Liability">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, {APP_NAME} WILL NOT BE LIABLE FOR ANY INDIRECT,
          INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR
          USE OF THE SERVICE.
        </p>
      </LegalSection>

      <LegalSection heading="10. Governing Law">
        <p>
          These Terms are governed by the laws of the jurisdiction in which {APP_NAME} is
          incorporated, without regard to conflict-of-laws principles.
        </p>
      </LegalSection>

      <LegalSection heading="11. Changes to These Terms">
        <p>
          We may update these Terms from time to time. Material changes will be notified through
          the Service or by email. Continued use of the Service after a change takes effect
          constitutes acceptance of the revised Terms.
        </p>
      </LegalSection>

      <LegalSection heading="12. Contact">
        <p>Questions about these Terms can be sent to legal@consentra.example (placeholder contact).</p>
      </LegalSection>
    </LegalPageLayout>
  )
}
