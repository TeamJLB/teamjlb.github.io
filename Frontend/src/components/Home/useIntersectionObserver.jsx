import { useEffect, useRef } from "react";

const useIntersectionObservation = (setActiveId) => {
  const contentRef = useRef({});

  useEffect(() => {
    const callback = (observedContent) => {
      observedContent.forEach((content) => {
        contentRef.current[content.target.id] = content;
      });

      const visibleContent = Object.values(contentRef.current).filter(
          (content) => content.isIntersecting
      );

      setActiveId(visibleContent[0].target.id);
    };
    //1. 새로운 observer 설정
    const observer = new IntersectionObserver(callback, {
      rootMargin: "0px",
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
    });

    //2. DOM 요소 찾고 Observer달아주기
    const contents = [...document.querySelectorAll(".content")];

    contents.forEach((content) => observer.observe(content));

    //3. 언 마운트시 옵저버 해제
    return () => observer.disconnect();
  }, [setActiveId]);
};

export default useIntersectionObservation;