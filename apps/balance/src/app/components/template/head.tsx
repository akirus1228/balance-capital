import React from "react";

import { Helmet } from "react-helmet";

const Head = (title: string, description: string) => {
  return (
    <Helmet
      title={`Balance Capital | ${title}`}
      htmlAttributes={{
        lang: "en",
      }}
    >
      <meta name="description" content={`${description}`} />
    </Helmet>
  );
};

export default Head;
