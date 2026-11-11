# José R. Correia — personal website

Source for my academic website, served with GitHub Pages at **https://jrcccc.github.io**.

I'm a cosmologist and postdoctoral research fellow at the Institute of Theoretical Astrophysics, University of Oslo, working on large-scale simulations of the early Universe: topological defects, axions, and gravitational waves from phase transitions.

## Pages

- **About**: short bio and research topics
- **Resume**: employment, education, and honors, awards & grants
- **Publications**: papers, with links to arXiv and the Springer Theses book
- **Contact**: map and a contact form

## Structure

```
index.html            all page content (single-page site)
assets/css/style.css  styles; theme colors are CSS variables at the top
assets/js/script.js   sidebar toggle, page navigation, form validation
assets/images/        avatar, icons
```

## Running locally

It's a static site, so any local web server works:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Contact form

The form posts to [FormSubmit](https://formsubmit.co), which forwards messages by email. The first submission from the live site triggers a one-time activation email that must be confirmed before messages are delivered.

## Links

- [ORCID](https://orcid.org/0000-0002-3375-0997)
- [INSPIRE-HEP](https://inspirehep.net/authors/2014849)

## Credits

Based on the [vCard personal portfolio](https://github.com/codewithsadee/vcard-personal-portfolio) template by codewithsadee, released under the MIT License (see [LICENSE](LICENSE)).
