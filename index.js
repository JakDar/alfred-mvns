"use strict";
const alfy = require("alfy");
const dateFormat = require("date-format");

let q = alfy.input;
const s = q.split(":");

if (s.length > 1) {
  q = "g:" + s[0];
  if (s[1]) {
    q = q + " AND " + "a:" + s[1];
  }

  if (s.length > 2 && s[2]) {
    q = q + " AND " + "v:" + s[2];
  }
}

alfy
  .fetch("http://search.maven.org/solrsearch/select", {
    query: {
      q,
      start: 0,
      rows: 20
    }
  })
  .then(data => {
    const items = data.response.docs.map(x => {
      const v = x.v ? x.v : x.latestVersion;
      const  web = `https://search.maven.org/artifact/${x.g}/${x.a}/${v}/jar `;
      const sbt = `"${x.g}" % "${x.a}" % "${v}",`;
      const gradle = `compile '${x.g}:${x.a}:${v}'`;
      return {
        title: `${x.g}:${x.a}:${v}`,
        subtitle: `updated at ${dateFormat(
          "yyyy-dd-MM",
          new Date(x.timestamp)
        )}`,
        arg: sbt,
        mods: {
          ctrl: {
            arg: web,
            subtitle: `Web link to clipboard`
          },
          alt: {
            arg: gradle,
            subtitle: `copy gradle dependency to clipboard`
          }
        }
      };
    });

    alfy.output(items);
  });
