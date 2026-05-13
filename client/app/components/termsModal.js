"use client";

import { useEffect } from "react";

export default function TermsModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center px-4">

      <div className="bg-white w-full max-w-4xl max-h-[85vh] rounded-[30px] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#111111]">
            Terms & Conditions — XVital
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-5 text-sm text-[#3E1747]/85 leading-relaxed">

          <div>
            <p className="font-medium">
              Effective date: 2026, February 9th
            </p>
          </div>

          <p>
            These Terms & Conditions (“Terms”) govern your access to and use of
            xvital.in (the “Website”) and any related services, content, and
            products offered by XVital (“XVital”, “we”, “us”, “our”). By
            accessing or using the Website, creating an account, or purchasing
            any plan/service, you agree to be bound by these Terms. If you do
            not agree, do not use the Website or purchase any services.
          </p>

          <div>
            <h3 className="font-semibold text-[#111111] mb-2">
              1) Eligibility
            </h3>

            <p>
              You must be at least 18 years old to use this Website and
              purchase services. If you are under 18, you may use the Website
              only with the consent and supervision of a parent/guardian.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-[#111111] mb-2">
              2) Scope of Services
            </h3>

            <p>
              XVital provides nutrition and wellness education and support,
              including (as applicable) questionnaires, general guidance,
              customized meal plans, fitness/lifestyle suggestions, and support
              as described at the point of purchase (“Services”).
            </p>

            <p className="mt-3">
              We guarantee the deliverables of the plan you purchase (for
              example: a customized plan, instructions, and the support/revision
              terms stated at checkout). We do not guarantee specific health
              outcomes or results, because results depend on factors outside our
              control (including medical history, genetics, sleep, stress,
              environment, and adherence).
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-[#111111] mb-2">
              3) Not Medical Advice + Scope of Practice
            </h3>

            <p>
              XVital is a nutrition and wellness platform. The founder of
              XVital is a certified nutritionist, and all guidance provided
              through this Website and our Services is limited strictly to
              nutrition, diet, fitness, and general lifestyle support.
            </p>

            <p className="mt-3">
              All content on this Website and within Services is provided for
              general educational and informational purposes only and is not
              medical advice. XVital does not provide medical diagnosis, medical
              treatment, prescriptions, or clinical care.
            </p>

            <p className="mt-3">
              You agree that you will not use our content or plans to diagnose,
              prevent, treat, cure, or manage any disease or medical condition.
            </p>

            <p className="mt-3">
              If you have any medical condition, symptoms, are taking
              medication, have allergies, or have a history of injury or
              clinical diagnosis, you should consult a licensed, practicing
              doctor/physician before starting or modifying any diet, exercise,
              supplement, or lifestyle routine. XVital’s guidance is not a
              substitute for medical care.
            </p>

            <p className="mt-3">
              Do not ignore or delay seeking medical advice because of
              information you read or receive from XVital. In case of a medical
              emergency, contact local emergency services immediately.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-[#111111] mb-2">
              4) High-Risk Users
            </h3>

            <p>
              You must consult your healthcare provider before starting any plan
              if you are pregnant or nursing, under 18, have allergies, have a
              known medical condition, or are taking prescription medication.
            </p>

            <p className="mt-3">
              You are solely responsible for disclosing accurate information
              (including allergies, conditions, and medications) during
              onboarding or questionnaires. Incomplete or inaccurate disclosures
              may impact the safety or suitability of recommendations.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-[#111111] mb-2">
              5) User Account & Responsibilities
            </h3>

            <p>If you create an account:</p>

            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>
                You are responsible for maintaining the confidentiality of login
                credentials.
              </li>

              <li>
                You agree to provide accurate, current information.
              </li>

              <li>
                You are responsible for all activities that occur under your
                account.
              </li>
            </ul>

            <p className="mt-3">
              We may suspend or terminate accounts that violate these Terms or
              applicable law.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-[#111111] mb-2">
              6) Payments, Subscriptions, Refunds
            </h3>

            <p>
              Pricing, deliverables, duration, and support terms are displayed
              at checkout or on the purchase page.
            </p>

            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>
                Payments: You agree to pay all fees and applicable taxes as
                displayed.
              </li>

              <li>
                Subscriptions (if applicable): Subscription billing terms,
                renewal, and cancellation rules will be shown during purchase.
              </li>

              <li>
                Refunds: Refund eligibility (if any) is governed by the Refund
                Policy displayed at checkout or published on the Website. If no
                refund policy is stated for a specific product/service, then
                refunds are not guaranteed.
              </li>
            </ul>

            <p className="mt-3">
              Chargebacks / disputes: Payment disputes must be raised with us
              first at connect@xvital.in. If a chargeback is filed without first
              contacting us, we may temporarily suspend access while we
              investigate and respond.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-[#111111] mb-2">
              7) Plan Delivery, Revisions & Support
            </h3>

            <p>
              Plan delivery timelines, revision limits, and support terms (if
              included) will be stated at the point of purchase.
            </p>

            <p className="mt-3">You agree that:</p>

            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>
                Delivery timelines may depend on you submitting required
                information promptly (e.g., onboarding forms, measurements,
                preferences, medical cautions).
              </li>

              <li>
                Revisions are limited to what is included in your plan/package.
              </li>

              <li>
                Support is limited to the channel and time window stated at
                purchase.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[#111111] mb-2">
              8) Products, Supplements & Claims (If Offered)
            </h3>

            <p>
              Where products are offered (including functional foods,
              nutraceuticals, or supplements), they are intended to support
              general wellbeing and are not medicines. They must not be relied
              upon as medical treatment.
            </p>

            <p className="mt-3">
              No statement on this Website should be understood as a disease
              claim, including claims of prevention, treatment, cure, or
              management of any disease or medical condition.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-[#111111] mb-2">
              9) Acceptable Use
            </h3>

            <p>You agree not to:</p>

            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>Use the Website for unlawful purposes.</li>

              <li>
                Copy, modify, distribute, sell, or exploit our content without
                written permission.
              </li>

              <li>
                Attempt to hack, disrupt, scrape, reverse engineer, or
                interfere with the Website.
              </li>

              <li>
                Upload harmful code, spam, or abusive/defamatory content.
              </li>
            </ul>

            <p className="mt-3">
              We reserve the right to restrict access for violations.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-[#111111] mb-2">
              10) Intellectual Property
            </h3>

            <p>
              All Website content (including text, plans, templates, branding,
              logos, graphics, videos, images, audio, downloads, and materials)
              is owned by or licensed to XVital and protected by applicable
              intellectual property laws.
            </p>

            <p className="mt-3">
              You receive a limited, personal, non-transferable,
              non-commercial license to access and use purchased materials for
              your own use only. You may not reproduce, publish, redistribute,
              sell, rent, sublicense, or create derivative works from our
              content without prior written permission.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-[#111111] mb-2">
              11) Content Creation, Social Media & Anti-Copying Clause
            </h3>

            <p>
              XVital creates and publishes original content across the Website
              and through official marketing channels, including (without
              limitation) Instagram, X (formerly Twitter), Facebook, LinkedIn,
              WhatsApp Business, and other Meta platforms. Our official social
              handle is @xvitalnow and our Website is xvital.in (together,
              “XVital Content”).
            </p>

            <ol className="list-decimal pl-6 mt-3 space-y-3">
              <li>
                Ownership: All XVital Content (including reels, videos, scripts,
                captions, posts, PDFs, guides, templates, plans, graphics, and
                educational materials) is owned by or licensed to XVital unless
                expressly stated otherwise.
              </li>

              <li>
                No copying / reuse: You may not copy, reproduce, repost,
                distribute, download for redistribution, modify, translate,
                watermark, rebrand, re-upload, sell, rent, sublicense, or
                commercially exploit any XVital Content (in whole or part)
                without prior written permission from XVital.
              </li>

              <li>
                Permitted sharing: You may share XVital Content only by sharing
                the original link/post from our official channels or Website,
                provided you do not alter the content, remove branding, or
                represent it as your own.
              </li>

              <li>
                Enforcement: Unauthorized use may result in
                suspension/termination of access and XVital may take appropriate
                legal action (including seeking injunctions, damages, account of
                profits, and recovery of legal costs) as permitted under
                applicable law.
              </li>

              <li>
                Reporting infringement: If you believe XVital Content has been
                misused or infringed, contact connect@xvital.in with relevant
                links/screenshots and supporting proof.
              </li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-[#111111] mb-2">
              12) Testimonials & Examples
            </h3>

            <p>
              Testimonials, examples, and success stories (if shown) reflect
              individual experiences and are not a promise of identical results
              for every user.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-[#111111] mb-2">
              13) Third-Party Links
            </h3>

            <p>
              The Website may include links to third-party websites or
              resources. We do not control, endorse, or assume responsibility
              for third-party content, products, services, or policies. Access
              them at your own risk.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-[#111111] mb-2">
              14) Limitation of Liability
            </h3>

            <p>
              To the fullest extent permitted by law, XVital (xvital.in) and
              its founders, team members, partners, affiliates, and employees
              will not be liable for any direct or indirect loss, injury,
              adverse reaction, incidental, special, consequential, or punitive
              damages arising from:
            </p>

            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>your use of or reliance on the Website or Services,</li>

              <li>any plan, recommendation, or content,</li>

              <li>any third-party links or products,</li>

              <li>any delay or inability to access the Website.</li>
            </ul>

            <p className="mt-3">
              You acknowledge that you are solely responsible for your
              decisions, actions, and outcomes.
            </p>

            <p className="mt-3">
              Nothing in these Terms excludes or limits any consumer rights that
              cannot be excluded under applicable law.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-[#111111] mb-2">
              15) Indemnity
            </h3>

            <p>
              You agree to indemnify and hold harmless XVital and its founders,
              team members, partners, affiliates, and employees from any
              claims, losses, liabilities, and expenses (including legal fees)
              arising out of:
            </p>

            <ul className="list-disc pl-6 mt-3 space-y-2">
              <li>your breach of these Terms,</li>

              <li>your misuse of the Website or Services,</li>

              <li>your violation of any law or third-party rights,</li>

              <li>
                any false, inaccurate, or incomplete information you provide.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-[#111111] mb-2">
              16) Termination
            </h3>

            <p>
              We may suspend or terminate your access to the Website or
              Services at any time if we reasonably believe you have violated
              these Terms or applicable law. Upon termination, your right to
              access the Services ends immediately.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-[#111111] mb-2">
              17) Changes to Terms
            </h3>

            <p>
              We may update these Terms from time to time. Changes will be
              posted on this page with an updated effective date. Continued uses
              of the Website after changes means you accept the updated Terms.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-[#111111] mb-2">
              18) Governing Law & Jurisdiction
            </h3>

            <p>
              These Terms are governed by the laws of India. Courts at
              Bengaluru, Karnataka shall have exclusive jurisdiction, subject to
              applicable consumer protection laws.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-[#111111] mb-2">
              19) Contact
            </h3>

            <p>
              XVital
              <br />
              Email: connect@xvital.in
              <br />
              Phone: +91 9118866992
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-[#111111] mb-2">
              20) Acceptance (I Agree)
            </h3>

            <p>
              By clicking “I Agree”, creating an account, accessing the Website,
              or purchasing any plan/service, you confirm that you have read,
              understood, and agree to be legally bound by these Terms &
              Conditions.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-5 border-t flex justify-end">
          <button
            onClick={onClose}
            className="bg-[#3E1747] text-white px-6 py-2 rounded-full hover:bg-[#4EDDE2] hover:text-[#3E1747] transition-all duration-300"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}