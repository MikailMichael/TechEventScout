import { useEffect } from "react"; // React hook that runs on component render
import Mark from 'mark.js'; // default export from mark.js

// Custom React hook, runs anytime searchTerm/rootSelector changes
// So when user types into the search input, logic reruns to update highlights
export default function useHighlight(searchTerm, rootSelector = 'body') {
  useEffect(() => {
    const context = document.querySelector(rootSelector); // Finds DOM element to search in
    const instance = new Mark(context); // Creates new mark.js instance tied to the selected DOM element

    instance.unmark({ // Removes all existing highlights in target element (prevent stacking highlights)
      done: () => { // Callback using the done property, runs once unmarking is finished
        // Wrap matching text inside a span with class "highlight"
        if (searchTerm) {
          instance.mark(searchTerm, {
            element: "span",
            className: "highlight"
          });
        }
      }
    });
  }, [searchTerm, rootSelector]); // This tells React to rerun the effect whenever searchTerm or rootSelector Changes
}