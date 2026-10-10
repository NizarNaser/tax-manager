export const metadata = {
  title: "Terms of Service",
  description: "The terms that govern use of TaxManager.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto glass rounded-[2rem] border border-white/5 p-8 sm:p-12 space-y-8 text-slate-300 leading-relaxed">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-sm text-slate-500">Last updated: [DATE]</p>
      </div>

      <p className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-sm text-yellow-500/90">
        Template notice: bracketed fields must be filled in with your real business details. This text is a
        structural starting point, not legal advice — have it reviewed by a lawyer before publishing.
      </p>

      <Section title="1. The Service">
        <p>
          TaxManager ("the Service") is operated by [COMPANY NAME] ("we", "us"). It is a tool for creating
          invoices, tracking income and expenses, and generating financial reports. By creating an account
          and using the Service, you agree to these terms.
        </p>
      </Section>

      <Section title="2. Your Account">
        <p>
          You sign in using your Google account. You are responsible for keeping that account secure and
          for all activity under it. You must provide accurate information in the invoices and settings you
          create.
        </p>
      </Section>

      <Section title="3. Your Data, Your Responsibility">
        <p>
          You retain ownership of the invoice and business data you enter. The Service is a record-keeping
          and presentation tool — it does not provide tax, accounting, or legal advice, and does not
          guarantee that invoices generated meet every requirement of your specific jurisdiction. You are
          responsible for verifying that your invoices and tax filings comply with the laws applicable to
          you.
        </p>
      </Section>

      <Section title="4. Acceptable Use">
        <ul className="list-disc pl-6 space-y-1">
          <li>Do not use the Service for unlawful, fraudulent, or abusive purposes.</li>
          <li>Do not attempt to gain unauthorized access to other users' data or to the underlying systems.</li>
          <li>Do not upload content you do not have the right to upload.</li>
        </ul>
      </Section>

      <Section title="5. Availability">
        <p>
          We aim to keep the Service available but do not guarantee uninterrupted access. We may perform
          maintenance, and the Service is provided "as is" without warranties of any kind, to the fullest
          extent permitted by law.
        </p>
      </Section>

      <Section title="6. Limitation of Liability">
        <p>
          To the extent permitted by applicable law, [COMPANY NAME] is not liable for indirect, incidental,
          or consequential damages arising from use of the Service, including errors in financial reports
          or invoices generated. Nothing in these terms excludes liability that cannot be excluded under
          applicable law.
        </p>
      </Section>

      <Section title="7. Termination">
        <p>
          You may stop using the Service and request deletion of your account at any time. We may suspend
          or terminate accounts that violate these terms.
        </p>
      </Section>

      <Section title="8. Changes to These Terms">
        <p>
          We may update these terms from time to time. Continued use of the Service after changes take
          effect constitutes acceptance of the updated terms.
        </p>
      </Section>

      <Section title="9. Governing Law">
        <p>These terms are governed by the laws of [JURISDICTION, e.g. "Germany"].</p>
      </Section>

      <Section title="10. Contact">
        <p>Questions about these terms can be sent to [CONTACT EMAIL].</p>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="space-y-2">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      {children}
    </section>
  );
}
