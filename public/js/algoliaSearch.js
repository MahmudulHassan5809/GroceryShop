var client = algoliasearch("B81GZXY2VQ", "6b9500f30a0e4270b10a2b1b637a322a");
var index = client.initIndex('ProductSchema');
//initialize autocomplete on search input (ID selector must match)
autocomplete('#aa-search-input',
{ hint: false }, {
    source: autocomplete.sources.hits(index, {hitsPerPage: 5}),
    //value to be displayed in input control after user's suggestion selection
    displayKey: 'name',
    //hash of templates used when rendering dataset
    templates: {
        //'suggestion' templating function used to render a single suggestion
        suggestion: function(suggestion) {

          return '<a href="/product/' + suggestion.slug + '"><span>' +
            suggestion._highlightResult.name.value + '</span></a>';
        }
    }
});
