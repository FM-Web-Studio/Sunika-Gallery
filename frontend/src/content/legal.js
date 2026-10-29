// The privacy policy and terms of use. Plain data so the wording lives in one place.
// A block is a paragraph (string) or a bullet list (array). [text](url) becomes a link.
// Change LEGAL_UPDATED whenever the meaning of either document changes.

export const LEGAL_UPDATED = '29 October 2026';

export const LEGAL_FALLBACK = {
  name: 'Sunika Lombard',
  email: 'lombardsunika@gmail.com',
  location: 'South Africa',
  phone: '',
};

export const SITE_URL = 'https://sunika-studio-gallery.web.app';

// How long a contact message is kept. The form writes the matching expiry date, and
// firestore.rules (in the portfolio repo) only accepts an expiry between 300 and 400 days away.
export const MESSAGE_RETENTION_DAYS = 365;

const RECAPTCHA_NOTE = 'To keep out spam and automated abuse, the site uses Google reCAPTCHA, through Firebase App Check, to confirm that requests come from a real browser on this site. reCAPTCHA reads information about your browser and device and sends it to Google, and may set its own cookies. See [Google\'s privacy policy](https://policies.google.com/privacy) and [terms](https://policies.google.com/terms).';

export const privacyPolicy = ({ name, email, location, recaptcha }) => ({
  title: 'Privacy policy',
  intro: 'What this gallery collects about you, why, and what you can do about it. The short version: no tracking, no advertising and no cookies of my own. Hearts and ratings are anonymous, and if you send me a message I keep it so I can reply.',
  sections: [
    {
      heading: 'Who is responsible',
      blocks: [
        `This gallery belongs to ${name}, an artist based in ${location}. I am the responsible party for your personal information under the Protection of Personal Information Act, 2013 (POPIA), and the controller for the purposes of the EU and UK GDPR. You can reach me at [${email}](mailto:${email}).`,
        'The site is built and looked after for me by Francois Meiring, who acts as my operator under POPIA. He handles information on the site only on my instructions and only to keep it running.',
      ],
    },
    {
      heading: 'What I collect',
      blocks: [
        [
          'Messages. When you use the Contact page: your name, your email address, your message (which may name the piece you asked about), and the time it was sent.',
          'Hearts and ratings. The first time you leave a heart or a star rating, Firebase gives your browser a random, anonymous ID. With it I store which piece you hearted or rated, the number of stars, and when. The ID is not linked to your name, email or any account, and nothing is created for visitors who only look around.',
          'Buying a piece. If we agree a sale, I keep the details needed to complete it, such as your name, contact details, a delivery address if the piece is sent to you, and a record of the sale. We exchange these by email or message, not through this site.',
          'Visits. The site is served by Google Firebase Hosting, which, like every web host, receives your IP address, browser details and the page requested in order to deliver it. I do not run analytics, advertising or tracking scripts, and I do not build a profile of you.',
        ],
        'Please do not send special personal information (health, religion, political views and the like) or anything about children through the form. I do not need it.',
      ],
    },
    {
      heading: 'Why I use it',
      blocks: [
        [
          'To read and reply to your message, and to arrange a sale you ask about. The basis is your request (POPIA section 11(1)(a) and (d); GDPR article 6(1)(b) and (f)).',
          'To count hearts and ratings fairly, one per visitor for each piece. The basis is my legitimate interest in honest counts.',
          'To keep the site running and secure, for example to stop the form or the ratings being abused, and to keep the sales records the law requires.',
        ],
        'I never sell, rent or trade personal information, and I will not add you to a mailing list.',
      ],
    },
    {
      heading: 'Where it goes',
      blocks: [
        [
          'Google (Firebase and Google Cloud) hosts the site, stores the artwork images, issues the anonymous IDs, and keeps messages, hearts and ratings in a database in Belgium (europe-west1). See [Google\'s privacy policy](https://policies.google.com/privacy).',
          'A small program in the same Google Cloud region emails a copy of each message to my Gmail inbox so I can reply. Your email address is set as the reply address.',
          'If a piece is sent to you by courier, the courier receives the name, address and phone number needed to deliver it, and nothing more.',
          ...(recaptcha ? ['Google reCAPTCHA checks that the form and the ratings are used by people and not bots. See the cookies section below.'] : []),
        ],
        'Google stores or processes information outside South Africa. I rely on it because it is bound by data-protection terms that give protection comparable to POPIA (POPIA section 72), including the EU Standard Contractual Clauses where they apply.',
        'I would only share your information with anyone else if the law required me to.',
      ],
    },
    {
      heading: 'How long I keep it',
      blocks: [
        [
          'Messages are deleted from the database automatically 12 months after they arrive, and I delete the email copy in my inbox on the same schedule.',
          'Hearts and ratings are kept while the piece is in the gallery and are deleted with it. A heart is deleted straight away if you take it back.',
          'Records of a sale are kept for as long as tax and other laws require, and then deleted.',
        ],
      ],
    },
    {
      heading: 'Cookies and local storage',
      blocks: [
        'This site sets no cookies of its own. It saves a few small things in your browser\'s local storage: your light or dark theme and animation choice, which pieces you have hearted or rated so the buttons remember, and the time you last sent a message so the form can stop an accidental double send within a minute.',
        'If you leave a heart or a rating, Firebase also keeps your anonymous ID in your browser\'s storage (IndexedDB), so your vote still counts as yours when you come back. None of this leaves your device except the anonymous ID, which is sent with each vote. Clearing your browser data removes all of it, after which a new heart or rating gets a new ID.',
        'Fonts are part of the site itself, so no font service is contacted. Links to Instagram, LinkedIn, Behance and my portfolio site take you to those sites, which have their own terms and policies.',
        ...(recaptcha ? [RECAPTCHA_NOTE] : []),
      ],
    },
    {
      heading: 'Your rights',
      blocks: [
        'You may ask me to confirm whether I hold information about you, to see it, to correct it, or to delete it. You may object to my use of it and, where the GDPR applies, ask me to restrict it or hand it over in a portable form. Write to the address above. I will answer within 30 days and will not charge you. Because hearts and ratings are anonymous, I cannot link them to you. You can take a heart back at any time by tapping it again, and clearing your browser data cuts the link between your browser and your votes.',
        'If you are unhappy with how I handled your information, you may complain to the [Information Regulator of South Africa](https://inforegulator.org.za). If you are in the EU or UK, you may also complain to your local data-protection authority. I would appreciate the chance to put it right first.',
      ],
    },
    {
      heading: 'Security',
      blocks: [
        'The site is served only over HTTPS. Stored messages can be read only by me, enforced by the database\'s access rules and a signed-in, verified account, and each anonymous ID can read only its own votes. No system is perfectly secure, but if a breach ever affected your information I would tell you and the Information Regulator as POPIA requires.',
      ],
    },
    {
      heading: 'Children',
      blocks: [
        'Anyone may look around and leave a heart. Buying a piece is for adults. I do not knowingly collect information from anyone under 18. If you believe a child has sent me their details, tell me and I will delete them.',
      ],
    },
    {
      heading: 'Changes',
      blocks: [
        'If this policy changes, the new version will be posted here with a new date at the top. I will not use information you already sent in a way the policy did not allow when you sent it.',
      ],
    },
  ],
});

export const termsOfUse = ({ name, email, location, phone }) => ({
  title: 'Terms of use',
  intro: 'The ground rules for using this gallery and for buying a piece from it. By using the site you agree to them. If you do not, please do not use it.',
  sections: [
    {
      heading: 'Who I am',
      blocks: [
        [
          `Seller: ${name}, an individual artist.`,
          `Based in: ${location}.`,
          `Email: [${email}](mailto:${email})${phone ? `. Phone: ${phone}` : ''}.`,
          `Website: [${SITE_URL.replace('https://', '')}](${SITE_URL}).`,
        ],
        'How I handle personal information is set out in the [privacy policy](/privacy). The friendly summary of how sales work is in the [sales policy](/policy). If the two ever differ, these terms apply.',
      ],
    },
    {
      heading: 'Copyright in the artworks',
      blocks: [
        'Every artwork, image and text on this site is my original work and is protected by copyright, and I keep that copyright, including after a piece is sold. Buying an artwork gives you the physical artwork itself. It does not give you the right to reproduce it, for example as prints, cards, products, or in advertising, without my written permission.',
        [
          'You may view the site and share links to it.',
          'Do not copy, download, screenshot for reuse, print, edit or republish the images.',
          'Do not use any image or text on this site to train, test or prompt artificial intelligence or machine-learning systems, or to build datasets.',
          'Do not scrape or bulk download the site.',
        ],
      ],
    },
    {
      heading: 'How buying works',
      blocks: [
        'There is no checkout on this site. To buy a piece, ask about it through the Contact page or by email. An enquiry, and a price or "available" label on the site, is an invitation to talk, not a binding sale.',
        [
          'A sale is only agreed once I confirm it to you in writing, for example by email, with the piece, the price, how you will pay, and how you will receive it, and you accept.',
          'Prices are shown in South African rand. They and the availability of each piece may change at any time before a sale is confirmed, and a piece may sell to someone else first. If a price on the site is wrong, I will tell you before we confirm anything.',
          'Collection or delivery is arranged with you before payment. Any delivery cost is quoted to you before you pay and is paid by the buyer.',
          'Commissions are agreed separately in writing, including the price, any deposit and the timing.',
        ],
      ],
    },
    {
      heading: 'Colours, sizes and condition',
      blocks: [
        'I photograph every piece as accurately as I can, but colours look different on every screen and in different light, and an original has the marks and texture of handmade work. Sizes are given as accurately as I can. If colour or detail matters to you, ask for extra photos or a viewing before you buy.',
      ],
    },
    {
      heading: 'Cancelling and returns',
      blocks: [
        'Because every piece is one of a kind, I do not take returns or exchanges if you simply change your mind, to the extent the law allows. The law does give you these rights, and nothing in these terms takes them away:',
        [
          'If we agree the sale at a distance, for example by email or message, and you are buying as a consumer, you may cancel within 7 days after you receive the piece, without giving a reason, under section 44 of the Electronic Communications and Transactions Act, 2002. You pay only the direct cost of returning the piece, which must come back in the condition you received it, and I refund what you paid within 30 days of your cancellation. This right does not apply to commissions made to your own specifications.',
          'If a piece arrives damaged or is not what was described, tell me as soon as you can, with photos. Your rights under the Consumer Protection Act, 2008, apply, and we will put it right.',
        ],
      ],
    },
    {
      heading: 'Hearts and ratings',
      blocks: [
        'Hearts and star ratings are a light way for visitors to say which pieces they enjoy. They are anonymous, one per visitor for each piece, and are not reviews of a purchase or a statement about a piece\'s value. The counts are shown as they are, without any guarantee.',
        'Do not try to inflate or skew hearts or ratings, for example with scripts, bots or many browsers. I may remove votes that look automated or abusive.',
      ],
    },
    {
      heading: 'Acceptable use',
      blocks: [
        [
          'Do not use the contact form to send spam, advertising, abuse, malware or anything unlawful.',
          'Do not try to break, overload or gain unauthorised access to the site, its database or its admin area.',
          'Do not use the site in a way that infringes anyone\'s rights.',
        ],
        'I may block or delete messages, votes and traffic that break these rules.',
      ],
    },
    {
      heading: 'Availability and liability',
      blocks: [
        'The site is provided free of charge, as it is and as available. I may change, suspend or remove any part of it, or any piece, at any time. Links to other sites, including my portfolio and social media, take you to sites with their own terms.',
        'To the fullest extent the law allows, I am not liable for any loss or damage arising from your use of the site or from sites it links to. Nothing in these terms limits any right you have, or any liability I have, that cannot lawfully be limited, including under the Consumer Protection Act, 2008, and the Electronic Communications and Transactions Act, 2002.',
      ],
    },
    {
      heading: 'Law and changes',
      blocks: [
        'These terms are governed by the law of the Republic of South Africa, and its courts have jurisdiction over any dispute, without taking away any protection you have under the law of the place you live. If any part of these terms is found unenforceable, the rest still applies.',
        'I may update these terms. The version and date posted here apply from the time they are posted. A sale is governed by the terms that applied when it was confirmed.',
      ],
    },
  ],
});
