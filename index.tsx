import { h, Fragment, useState } from "./createElement";

const items = [
  { planet: "Mercury", size: 2.44 },
  { planet: "Venus", size: 6.052 },
  { planet: "Earth", size: 6.371 },
  { planet: "Mars", size: 3.39 },
  { planet: "Jupiter", size: 69.911 },
  { planet: "Saturn", size: 58.232 },
  { planet: "Uranus", size: 25.362 },
  { planet: "Neptune", size: 24.622 },
] as const;

const htmlString = "<b>I'm bold</b>";

const html = (
  <div ref="kebab">
    <h1>Hello and welcome to the example page.</h1>
    <p>
      <b>T</b>est
    </p>
    <span style="color: green">Style as string</span>
    <span style={{ color: "red" }}>Style as object</span>
    <div
      // onMouseMove={(ev: MouseEvent) => console.log(ev)}
      style={{
        padding: "20px",
        border: "1px dashed #ccc",
        position: "relative",
      }}
    >
      This has onMouseMove event <br />
      Position: <code ref="mousepos"></code>
      <br />
      Buttons
      {":"}
      <button ref="pizza" disabled>
        Disabled knapp…
      </button>
      <button ref="clickButton" onClick={(e) => alert(e)}>
        Click knapp…
      </button>
    </div>
    <ce-app>
      <div class="insideslot">Inside slot</div>
    </ce-app>
    <hr />
    <h3>Primitives:</h3>
    {true}
    {false}
    {null}
    {undefined}
    {0}
    {Number(1)}
    {new Number(2)}
    {""}
    {[]}
    {{}}
    {String("Hello")}
    {"_"}
    {new String("world")}
    <hr />
    {'"><script>alert(document.cookie)</script>'}
    <div class="klass">klass</div>
    <div className="klassname">klassname</div>
    <ul>
      {items.map((i, index) => (
        <li ref="listItems">
          Name: <span ref={`planet${index}`}>{i.planet}</span>
          <br></br>
          Size: {i.size}
        </li>
      ))}
    </ul>
    <div>As text: {htmlString}</div>
    <div innerHTML={htmlString + " < innerHTML"}></div>
    <div textContent={htmlString + " < textContent"}></div>
    <label for="korv">Label attribute "for"</label>
    <input id="korv" />
    <label htmlFor="korv2">Label property "htmlFor"</label>
    <input id="korv2" />
    <>
      <div>Inside fragment</div>
    </>
    <>
      <>
        <>
          <div>
            <>
              <>Inside multiple fragment</>
            </>
          </div>
        </>
      </>
    </>
    <button disabled={false}>Boolean attributes (disabled=false)</button>
    <button disabled={true}>Boolean attributes (disabled=true)</button>
    <br />
    <CustomComponent />
    <CustomComponent />
  </div>
);

function Signal(initialValue) {
  let value = initialValue;
  const Emitter = {
    listeners: new Set<Function>(),
    subscribe(fn) {
      console.log("subscribe", fn);
      this.listeners.add(fn);
      fn(value);
      return () => this.listeners.delete(fn);
    },
    publish(nextValue) {
      if (typeof nextValue === "function") {
        nextValue = nextValue(value);
      }
      value = nextValue;
      [...this.listeners].forEach((listener) => listener(value));
    },
  };
  return [Emitter.publish.bind(Emitter), Emitter.subscribe.bind(Emitter)];
}

function CustomComponent() {
  let toggle = false;
  const [pub, sub] = Signal(toggle);

  return (
    <div>
      <span
        ref={(element) => {
          console.log("ref", element);
          sub((t) => {
            console.log("got it", t);
            // element.innerHTML = t ? "ON" : "OFF";
            element.replaceChildren(<RenderProps value={t} />);
          });
        }}
      >
        Loading...
      </span>
      <button
        onClick={() => {
          pub((current) => !current);
        }}
      >
        Press me
      </button>
    </div>
  );
}

function RenderProps(props) {
  return (
    <pre>
      <code>{JSON.stringify(props, null, 2)}</code>
    </pre>
  );
}

// const html2 = (<div><ul>
//   {items.map((i, index) => (
//       <li ref="listItems">
//         Name: <span ref={`planet${index}`}>{i.planet}</span>
//         <br></br>
//         Size: {i.size}
//       </li>
//   ))}
// </ul></div>)

document.body.append(html);
