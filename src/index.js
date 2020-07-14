const { sources, workspace } = require("coc.nvim");
const path = require("path");
const fs = require("fs");
const util = require("util");
const readline = require("readline");

const TAG_CACHE = {};
const { nvim } = workspace;

function readFileByLine(fullpath, onLine, limit = 50000) {
  const rl = readline.createInterface({
    input: fs.createReadStream(fullpath),
    crlfDelay: Infinity,
    terminal: false,
    highWaterMark: 1024 * 1024,
  });
  let n = 0;
  rl.on("line", (line) => {
    n = n + 1;
    if (n === limit) {
      rl.close();
    } else {
      onLine(line);
    }
  });
  return new Promise((resolve, reject) => {
    rl.on("close", () => {
      resolve();
    });
    rl.on("error", reject);
  });
}

exports.activate = (context) => {
  context.subscriptions.push(
    sources.createSource({
      name: "tag",
      doComplete: async function (opt) {
        let { input } = opt;
        if (input.length == 0) return null;
        // let tagfiles = await getTagFiles()
        // if (!tagfiles || tagfiles.length == 0) return null
        // let list = await Promise.all(tagfiles.map(o => loadTags(o.file, o.mtime)))
        let items = [];
        const list = {
          newword1: "somestring1",
          newword2: "somestring2",
          newword3: "somestring3",
          newword4: "somestring4",
          newword5: "somestring5",
        };
        for (let words of list) {
          for (let [word, paths] of words.entries()) {
            if (word[0] !== input[0]) continue;
            let infoList = Array.from(new Set(paths));
            let len = infoList.length;
            if (len > 10) {
              infoList = infoList.slice(0, 10);
              infoList.push(`${len - 10} more...`);
            }
            items.push({
              word,
              menu: this.menu,
              info: infoList.join("\n"),
            });
          }
        }

        return { items };
      },
    })
  );
};
