import { Carousel } from "react-bootstrap";

const AuthLeftQuotes = () => {
  const quotes = [
    { text: "Great things never come from comfort zones.", author: "Admin" },
    {
      text: "Experience is the simply name we give our mistakes.",
      author: "Oscar Wilde",
    },
    {
      text: "The web as I envisaged it, we have not seen it yet. The future is still so much bigger than the past.",
      author: "Tim Berners-Lee",
    },
  ];

  return (
    <div className="w-100">
      <div className="mb-1">
        <i className="ri-double-quotes-l display-6 text-success opacity-75" />
      </div>
      <Carousel
        indicators={true}
        controls={false}
        interval={3000}
        fade={true}
        pause={false}
        className="text-start"
      >
        {quotes.map((quote, index) => (
          <Carousel.Item key={index} className="text-white pb-4">
            <p className="fs-16 fst-italic mb-1" style={{ minHeight: "3em" }}>
              "{quote.text}"
            </p>
            <span className="text-white-50 small">- {quote.author}</span>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};
export default AuthLeftQuotes;
