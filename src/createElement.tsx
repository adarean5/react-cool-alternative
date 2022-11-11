type Props = Record<string, unknown>;

type Component = {
  type: CoolElement | ((props) => HTMLElement | string);
  props: Props;
  children: any[];
};

type CoolElement = keyof HTMLElementTagNameMap;

export const Fragment = 'Fragment';

let currentStyleContext: string[] = [];
let styleCounter = 0;
export const css = (strings, ...args) => {
  const className = `css_${styleCounter++}`;
  const computedStyle = strings.reduce((outputString, currentString, index) => {
    return `${outputString}${currentString}${args[index] ? args[index] : ''}`;
  }, '');
  currentStyleContext.push(`.${className} { ${computedStyle} }`);
  return className;
};

export function useState(initialState) {
  console.log('UseState called', currentContext);
  if (currentContext.hooks[currentContext.count]) {
    return currentContext.hooks[currentContext.count++]();
  }

  let state = initialState;

  const hook = () => {
    const setState = (value) => {
      console.log('State change', state, value);
      console.log('Current context', currentContext);

      state = value;

      const renderedElement = currentContext.render();
      console.log('Rendered Element', renderedElement.innerHTML);
    };

    return [state, setState] as const;
  };

  currentContext.hooks.push(hook);

  return hook();
}

let currentContext;

export function h(
  type: Component['type'],
  props: Component['props'],
  ...children: Component['children']
) {
  const wrapStyleResult = (resultElement: string | HTMLElement) => {
    console.log('result style', currentStyleContext);
    const resultStyle = currentStyleContext.join('\n');
    if (currentStyleContext.length) {
      currentStyleContext = [];
      return (
        <>
          {resultElement}
          <style>{resultStyle}</style>
        </>
      );
    }
    return resultElement;
  };
  if (typeof type === 'function') {
    const functionResult = type({ ...props, children });

    return wrapStyleResult(functionResult);
  }

  const { createElement } = getCurrentNamespace(type);
  const ele = createElement(type);

  // Object.assign(ele, props);
  const { ref, style, className, dataset, ...attr } = props ?? {};

  if (typeof style === 'object') {
    Object.assign(ele.style, style);
  }

  if (typeof className === 'string') {
    ele.className = className;
  }

  if (typeof dataset === 'object') {
    Object.assign(ele.dataset, dataset);
  }

  Object.entries(attr).forEach(([key, val]) => {
    if (key.startsWith('on') && typeof val === 'function') {
      ele.addEventListener(
        key.toLowerCase().replace('on', ''),
        val as EventListenerOrEventListenerObject
      );
    } else if (val === false) {
      //
    } else {
      ele.setAttribute(key, val as string);
    }
  });

  // console.log(children, ele);

  ele.append(
    ...children
      .map((child) => {
        // console.log("Condition", typeof child?.nodeType === "number");
        if (
          typeof child === 'object' &&
          typeof child?.nodeType !== 'number' &&
          !Array.isArray(child)
        ) {
          return (
            <pre>
              <code>{JSON.stringify(child, null, 2)}</code>
            </pre>
          );
        } else {
          return child;
        }
      })
      .flat(Infinity)
  );

  if (typeof ref === 'function') ref(ele);
  return wrapStyleResult(ele);
}

function getCurrentNamespace(type) {
  switch (type) {
    case 'svg':
    case 'path':
      return {
        createElement: (...args) =>
          document.createElementNS('http://www.w3.org/2000/svg', ...args),
      };
    default:
      return {
        createElement: document.createElement.bind(document),
      };
  }
}
