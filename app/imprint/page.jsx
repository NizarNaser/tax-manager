export const metadata = {
  title: "Imprint",
  description: "Legal disclosure (Impressum) for TaxManager.",
};

export default function ImprintPage() {
  return (
    <div className="max-w-3xl mx-auto glass rounded-[2rem] border border-white/5 p-8 sm:p-12 space-y-8 text-slate-300 leading-relaxed">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Imprint (Impressum)</h1>
        <p className="text-sm text-slate-500">Legal disclosure per § 5 TMG (Germany) / Art. 5 ECD (EU)</p>
      </div>

      <p className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4 text-sm text-yellow-500/90">
        Template notice: an Imprint is a legal requirement in Germany (and several other EU countries) for
        any commercially operated website. Every bracketed field below must be filled in with your real,
        verifiable business details — an incomplete or inaccurate Imprint can itself be a legal violation.
        Have this reviewed by a lawyer or tax advisor (Steuerberater) before publishing.
      </p>

      <Section title="Service Provider">
        <p>
          [FULL LEGAL NAME OF COMPANY OR INDIVIDUAL]<br />
          [LEGAL FORM, e.g. "Einzelunternehmen" / "GmbH" — omit if a sole individual]<br />
          [STREET ADDRESS]<br />
          [POSTAL CODE, CITY]<br />
          [COUNTRY]
        </p>
      </Section>

      <Section title="Contact">
        <p>
          Phone: [PHONE NUMBER]<br />
          Email: [CONTACT EMAIL]
        </p>
      </Section>

      <Section title="Represented By">
        <p>[NAME OF MANAGING DIRECTOR / OWNER]</p>
      </Section>

      <Section title="Register Entry">
        <p>
          [IF APPLICABLE: Commercial Register, Registering Court, Registration Number — e.g.
          "Handelsregister, Amtsgericht [City], HRB [number]". Omit this section entirely if not registered
          in a commercial register (e.g. a sole proprietor below the registration threshold).]
        </p>
      </Section>

      <Section title="VAT ID">
        <p>
          [VAT IDENTIFICATION NUMBER per § 27a UStG, if you have one — e.g. "DE123456789". Omit if not
          VAT-registered / using the small business exemption (Kleinunternehmerregelung).]
        </p>
      </Section>

      <Section title="Responsible for Content">
        <p>
          [NAME AND ADDRESS, per § 18(2) MStV — generally the same as "Represented By" above unless a
          different person is editorially responsible for site content.]
        </p>
      </Section>

      <Section title="EU Dispute Resolution">
        <p>
          The European Commission provides a platform for online dispute resolution (ODR):{" "}
          <a
            href="https://ec.europa.eu/consumers/odr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-500 hover:underline"
          >
            ec.europa.eu/consumers/odr
          </a>
          . [STATE WHETHER YOU PARTICIPATE IN CONSUMER DISPUTE RESOLUTION PROCEEDINGS — most small
          businesses are not obligated to and may state they do not participate.]
        </p>
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
