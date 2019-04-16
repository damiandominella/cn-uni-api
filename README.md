# Applied Computer Science - Uniurb - API

All endpoints are available under the _/api_ path (eg: for the news the path will be _/api/news_). 

Response are in the following format:

  - _**200**: OK_
  ```{"data": [], "count": 0} ```
  
  - _**404**: NOT FOUND_
  
  - _**500**: ERROR_
  ```{"error": {object}}```

### GET /api/news

```
{
  "data": [
    {
      "title": "Post title",
      "link": "https://informatica.uniurb.it/bulletin-board/url/",
      "pubDate": "2019-04-16T11:59:21.000Z",
      "author": "Post author",
      "content": "Post content",
      "contentEncoded": "<p>Post content</p>"
    }
  ],
  "count": 10
}
```

### GET /api/blog

```
{
  "data": [
    {
      "title": "Post title",
      "link": "https://informatica.uniurb.it/bulletin-board/url/",
      "pubDate": "2019-04-16T11:59:21.000Z",
      "author": "Post author",
      "content": "Post content",
      "contentEncoded": "<p>Post content</p>"
    },
  ],
  "count": 1
}
```

### GET /api/teachers

```
{
  "data": [
    {
      "name": "Teacher's name",
      "imgUrl": "https://informatica.uniurb.it/img.jpg",
      "email": "teacher@email.it",
      "phone": "+00 0000 00 000",
      "receptionHours": "Ricevimento: mer 16:00-18:00"
    },
  ],
  "count": 1
}
```

### GET /api/study_plan

```
{
  "data": [
    {
      "name": "Subject's name",
      "link": "https://informatica.uniurb.it/subject",
      "year": 1,
      "cfu": 9
    },
  ],
  "count": 1
}
```
