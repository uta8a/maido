# maido / WIP Static Site Generator (using Next.js)

# usage

```
DOCUMENT_ROOT=../../../../path/to/content yarn dev
```

# 開発中の画面

Books
![image-1](https://user-images.githubusercontent.com/31395466/151989014-c72124e7-3c07-49b8-a763-298a5119eedd.png)

Article
![image-2](https://user-images.githubusercontent.com/31395466/151988822-cde7b420-2d31-4907-9c9a-0add6c237a42.png)
# dev

```
yarn install
yarn husky install
```

# Todo

- デザイン
  - 左/右ボタンで前/次のコンテンツへ移動(mdbook風)
  - list, tocは閉じられる(mdbook風)
- テストを足す
- リファクタリング
  - コードの重複が多い

# Spec

## Terms

```
Project > Book > Article
```

- Project: Bookがまとまった、rootに相当するもの
- Book: ひとつのTopicに相当する、markdownファイル複数で構成されるもの。ディレクトリに対応。
- Article: markdown(.md)ファイルひとつに相当する

## Directory structure

```
book-dir/
  index.md (optional)
  toc.md
  thumbnail.png
  article-1-dir/
    index.md
    image.png
  article-2-file.md
```

## book-dir/index.md

自動生成するCLIコマンドがある

```md:index.md
+++
title = "index.md"
date = "2022-01-18T05:28:15+09:00"
draft = false
+++

# index.md

Hello
```

## book-dir/toc.md

自動生成するCLIコマンドがある(ディレクトリ構造を見て作る)

```md:toc.md
+++
image_path = "./thumbnail.png"
+++

- [index.md](./index.md)
```
