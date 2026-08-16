/* ==========================================================================
   Cath Crochets, site settings
   This is the only file you need to edit to hook the forms up.
   ========================================================================== */

window.SITE = {

  /* ----------------------------------------------------------------------
     1. FORMS

     Both forms on this site post to Formspree. It is free for up to
     50 messages a month and needs no server, which suits GitHub Pages.

     To turn them on:
       1. Sign up at https://formspree.io with cathcrochetsstore@gmail.com
       2. Make a new form, call it "Custom orders"
       3. Copy the ID out of the endpoint it gives you. The endpoint looks
          like https://formspree.io/f/xdorwkgb and the ID is the last bit,
          in that example xdorwkgb
       4. Paste it between the quotes below
       5. Do the same for a second form called "Mailing list"

     Until you do that, both forms still work. They fall back to opening
     the customer's own email app with everything already typed out, so
     nothing is lost in the meantime.
     ---------------------------------------------------------------------- */

  customOrderFormId: '',
  mailingListFormId: '',

  /* ----------------------------------------------------------------------
     2. CONTACT
     ---------------------------------------------------------------------- */

  email: 'cathcrochetsstore@gmail.com',

  /* ----------------------------------------------------------------------
     3. LINKS
     ---------------------------------------------------------------------- */

  etsy: 'https://www.etsy.com/uk/shop/CathCrochetsUK',
  etsyCustom: 'https://www.etsy.com/uk/shop/CathCrochetsUK#custom-request',
  instagram: 'https://www.instagram.com/cathcrochetsuk/',
  twitter: 'https://twitter.com/CathCrochets'
};
