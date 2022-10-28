import { h, Fragment, useState, render } from './createElement';

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
  </div>
);

function Second() {
  const [toggle, setToggle] = useState(false);
  return (<div>
    {toggle.toString()}
    <button onClick={()=>setToggle(!toggle)} >Toggle 3</button>
  </div>)
}

function CustomComponent() {
  let span;
  const [toggle, setToggle] = useState(false);
  const [toggle2, setToggle2] = useState(true);

  return (
    <div>
      <span
        ref={(node) => {
          span = node;
        }}
      >
        Me works!!! 🤣{" "}
      </span>
      <span>{toggle ? "ON" : "OFF"}</span>
      <span>{toggle2 ? "Yeees" : "Noooooes"}</span>
      <button
        onClick={() => {
          setToggle(!toggle);
        }}
      >
        Toggle it
      </button>
      <button
        onClick={() => {
          setToggle2(!toggle2);
        }}
      >
        Toggle second
      </button>
      <button
        onClick={() => {
          if (span) {
            span.innerText = "Yay";
          }
        }}
      >
        Press me
      </button>
      <Second></Second>
    </div>
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



document.body.append(render(html));
