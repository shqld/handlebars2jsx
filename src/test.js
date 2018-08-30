const cheerio = require('cheerio')

const $ = cheerio.load(`
{{#if asdf}} this {{else}} that {{/if}}

<div class={`content__main${{#if article.hasRelatedContents}} content__main--has-related-articles${{/if}}${{~#if isShortVariation}} content__main--short${{/if}}`}
   {{#if giftStatus.isEnabled}} data-js-gift-enabled=true{{/if}}
  data-js-gift-enabled={{#if giftStatus.isEnabled}}true{{/if}}
>
  {{#each items}} subTitle : {{subTitle}} {{/each}}
</div>

{{#each items}} 
<div />
 {{/each}}
{{#each items}}
  
<div asdf=>

   asdf
  </div>
{{/each}}

{{#with child}}
{{parentToo}}
{{onlyParent}}
{{/with}}
`)

console.log($('body').html())
