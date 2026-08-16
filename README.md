# Cath Crochets

The website for [CathCrochetsUK](https://www.etsy.com/uk/shop/CathCrochetsUK), a crochet shop in
Newcastle upon Tyne. It does not sell anything directly. Checkout stays on Etsy. What this site adds
is a proper custom order form, a size and measuring guide, care instructions, a mailing list signup
and a privacy policy.

Plain HTML, CSS and JavaScript. No framework, no build step, no dependencies. Edit a file, push it,
it is live.

---

## Two things to do before it goes live

### 1. Connect the forms

Both forms fall back to opening the visitor's own email app, so nothing breaks if you skip this.
But it is a much better experience for the customer if the form just sends.

1. Sign up at [formspree.io](https://formspree.io) using `cathcrochetsstore@gmail.com`
2. Create a form called **Custom orders**. It gives you an endpoint like
   `https://formspree.io/f/xdorwkgb`. The bit on the end, `xdorwkgb`, is the ID.
3. Create a second form called **Mailing list** and note its ID too.
4. Open `assets/js/config.js` and paste them in:

```js
customOrderFormId: 'xdorwkgb',
mailingListFormId: 'abcdwxyz',
```

The free tier covers 50 submissions a month. Anything else you might want to change, the contact
email and the social links, is in that same file.

### 2. Set the domain

Every page has a `<link rel="canonical">` and the sitemap has full URLs, all currently pointing at
`https://cathcrochets.co.uk/`. If the real domain is different, find and replace that string across
the project. It appears in the eight HTML pages, `sitemap.xml` and `robots.txt`.

For a custom domain on GitHub Pages, add a file called `CNAME` in the root containing just the
domain, then point the DNS at GitHub. Their
[docs cover it](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

Until then the site works fine on `username.github.io/Website`. Every link and asset path is
relative, so nothing needs rewriting to run in a subfolder.

One consequence worth knowing: `404.html` also uses relative paths, which is what a project
subfolder needs. The site is flat, so a mistyped URL lands one level deep and the 404 page still
styles itself correctly. If you ever move to a custom domain and start adding subfolders, switch
that one file back to root-relative paths (`/assets/...`) so a 404 at any depth still finds the CSS.

---

## What is where

```
index.html      Home
shop.html       All 45 items, filterable, each links to its Etsy listing
custom.html     The custom order form
sizing.html     Measuring guide, standard sizes, the 20 yarn colours
care.html       Washing, drying, snags, and pet safety
about.html      Cath and Lola
faq.html        Delivery, returns, products, plus a general question form
privacy.html    Privacy policy
404.html        Not found page

assets/css/style.css    All the styling, one file, commented by section
assets/js/config.js     Settings. The only file you need to edit
assets/js/site.js       Navigation, filters, forms, reveals
assets/fonts/           Fraunces and Karla, self hosted
assets/img/products/    45 product photos
assets/img/colours/     The five yarn colour charts
```

## Keeping it up to date

**Prices change.** They are written into `shop.html` next to each item. There is already a note on
that page telling customers Etsy has the live price, so this is not urgent, but it is worth a pass
every few months.

**New products.** Copy an existing block in `shop.html`, change the image, title, price and Etsy
listing ID, and set `data-cat` to one of: `cat-hats`, `collars`, `tamagotchi`, `gaming`, `readers`,
`home`, `people`, `baby`, `other`. Then bump the number in that category's filter chip.

**Product photos** came from the Etsy listings. To add one, download the image from the listing at
794px wide and drop it in `assets/img/products/`.

**Turnaround, postage and policies** are stated in `faq.html` and `sizing.html`. If the ten day
making time or the postage arrangements change, those two pages and the home page trust strip are
the places to look.

## Notes on how it is built

**No cookies, no analytics, no third party requests.** The fonts and every image are served from
this site, so a visitor's browser never contacts Google, a CDN or anyone else just to read a page.
That is why the privacy policy can say what it says. If you later add analytics, the privacy policy
has to change with it.

**It works without JavaScript.** Navigation, every link and both forms still function. With JS off
the forms tell the visitor to email instead, and the size fields all show at once rather than
matching what they picked.

**Accessibility.** Skip link, visible focus rings, real labels on every field, live regions on the
filters and form status, and `prefers-reduced-motion` is respected, which turns off the ticker and
the fade-ins.

**Testing locally.** Any static server will do. There is a `.claude/launch.json` that expects Python
on the path. If you do not have it, opening `index.html` in a browser works for everything except
the forms.

## Where the content came from

Sizes, turnaround times, postage arrangements, the yarn description, the colour charts, the review
quotes and the shop numbers are all taken from the live Etsy listings and shop policies as they
stood in August 2026. Nothing in the copy is invented. Where a number was not published, the page
asks the customer to send a measurement rather than stating one.
