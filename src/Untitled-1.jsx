import * as React from 'react'

export default props => {
  return (
    <>
      {asdf ? this : that}
      <div
        className={`content__main${article.hasRelatedContents &&
          'content__main--has-related-articles'}${isShortVariation &&
          'content__main--short'}`}
        /* HBS2JSX IGNORED {{#if giftStatus.isEnabled}} data-js-gift-enabled=true{{/if}} */
        data-js-gift-enabled={giftStatus.isEnabled && true}
        /* HBS2JSX IGNORED {{title}} */
      />
      {items.map(item => (
        <div>
          <div />
          <p>
            <img />
          </p>
        </div>
      ))}
      {child.parentToo}
      {child.onlyParent}
      <img src="dasdfsdfasdf" />
      adsfasdfas asdfasd
      {title}
    </>
  )
}
