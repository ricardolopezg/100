# :heavy_dollar_sign: :100: :bangbang:

[Github Markdown guide. :wink:]
(https://guides.github.com/features/mastering-markdown/)

```javascript
var OneHundred = React.createClass({
  ourState: function(){
      makingCommerceSocial: true
    },

    render: function() {
      return (
        <h1>
          100, We the Best!
        </h1>
      );
    }
});
```

## Assumptions made about your developer environment:
* MongoDB is installed and is running during use.

## Commands:
- run build:
```bash
npm run build
```
- run dev server: (pass in port as argument)
```bash
npm run serve [,3000]
```
- run test:
```bash
npm test
```

### Testing Toolset:
[Postman - for http(s) API calls]
(https://www.getpostman.com/)

[RoboMongo - connect to local or existing MongoDB]
(https://robomongo.org/)

### Directory Structure:
100 - | src (web app)
        - components/
        - routes/
        - store/
        - index.js
      | server/
        - db
        - models/
        - routes/
        - tests/
        - server.js
      | build (public)
        - index.html
        - bundle.js
        - bundle.css

#### Simple Todo:
- [x] start README.md.
- [ ] create proper documentation.
