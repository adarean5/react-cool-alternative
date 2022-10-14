type Props = Record<string, unknown>;

type Component = {
  type: CoolElement,
  props: Props,
  children: any[]
}

type CoolElement = keyof HTMLElementTagNameMap;

const Fragment = "Fragment"

function h(type: Component["type"], props: Component["props"], ...children: Component["children"]) {
  debugger
  const ele = document.createElement(type);
  // Object.assign(ele, props);
  const {style, className, dataset, ...attr} = props ?? {};
  if (typeof style === "object") {
    Object.assign(ele.style, style);
  }

  if (typeof className === "string") {
    ele.className = className;
  }

  if (typeof dataset === "object") {
    Object.assign(ele.dataset, dataset);
  }

  Object.entries(attr).forEach(([key, val]) => {
    if (key.startsWith("on") && typeof val === "function") {
      ele.addEventListener(key.toLowerCase().replace("on", ""), val as EventListenerOrEventListenerObject);
    } else if(val === false) {
      //
    } else {
      ele.setAttribute(key, val as string);
    }
  })

  console.log(children, ele);

  ele.append(...children.map((child) => {
    console.log("Condition", typeof child?.nodeType === "number")
    if (typeof child === "object" && typeof child?.nodeType !== "number" && !Array.isArray(child)) {
      return <pre><code>{JSON.stringify(child, null, 2)}</code></pre>;
    } else {
      return child;
    }
  }).flat(Infinity));

  return ele;
}



function render(component: Component, container: Element) {
  if (typeof component === 'string') {
    container.append()
  } else {

  }
}

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
          onMouseMove={(ev: MouseEvent) => console.log(ev)}
          style={{ padding: "20px", border: "1px dashed #ccc", position: "relative" }}
      >
        This has onMouseMove event <br />
        Position: <code ref="mousepos"></code>
        <br />
        Buttons
        {":"}
        <button ref="pizza" disabled textContent="Disabled knapp…" />
        <button ref="clickButton" textContent="Click knapp…" onClick={(e) => alert(e)} />
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
    </div>
);

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
