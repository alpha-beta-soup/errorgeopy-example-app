A demo Flask app that uses [errorgeopy](https://github.com/alpha-beta-soup/errorgeopy).

Running on Heroku, e.g. to forward geocode "1 Rugby Street, Wellington, NZ": https://errorgeopy.herokuapp.com/forward?address=1%20Rugby%20Street,%20Wellington,%20NZ

This uses seven different geocoding providers. Any issues noticed in the running application should be noted at the errorgeopy repository, not here (this is just a fun little demo to try it out). Although you're welcome to improve this demo if you'd like to fork it.

Github Pages: http://www.nearimprov.com/errorgeopy-example-app/

### Notes to self

- http://www.saintsjd.com/2014/05/12/run-vendored-binaries-on-heroku.html (helpful deployment tips, especially getting the GEOS binary compiled for Heroku)
- `git subtree push --prefix build/dist origin gh-pages` (changes to frontend (`demo/`))
- `git push heroku master` (for changes to backend (`app.py`, `Procfile`, etc.))
