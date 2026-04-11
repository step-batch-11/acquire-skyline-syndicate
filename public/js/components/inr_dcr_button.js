export class Counter extends HTMLElement {
  #count;
  #delta;

  constructor() {
    super();
    this.#count = 0;
    this.#delta = 1;
    this.color = "black";
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    // this.addHoverEffect();
    this.addCounterBtns();
  }

  setDelta(delta) {
    this.#delta = delta;
  }

  updateCount() {
    const el = this.shadowRoot.querySelector("#counter");
    el.textContent = this.#count;
  }

  addCounterBtns() {
    const incrementBtn = this.shadowRoot.querySelector("#increment");
    const decrementBtn = this.shadowRoot.querySelector("#decrement");

    incrementBtn.addEventListener("click", () => {
      this.#count = this.#count + this.#delta;
      this.updateCount();
    });

    decrementBtn.addEventListener("click", () => {
      if (this.#count <= 0) return;
      this.#count = this.#count - this.#delta;
      this.updateCount();
    });
  }
  render() {
    this.shadowRoot.innerHTML = `
    <style>
    * {
    padding: 0;
    margin: 0;
    }
    
    #counter {
      padding: 0.5em 0.25em;
      color: ${this.color};
      }
      
      #counter-container {
        
          display : flex; 

        }

      </style>
      <div id="counter-container"> 
      <button id="increment" > + </button>
      <p id="counter">${this.#count}</p>
      <button id = "decrement"> - </button>
      </div>
    `;
  }

  get count() {
    return this.#count;
  }
}
