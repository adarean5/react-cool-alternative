type Props = Record<string, unknown>;

type Component = {
	type: CoolElement | ((props) => ()=>HTMLElement) | string;
	props: Props;
	children: any[];
};

type CoolElement = keyof HTMLElementTagNameMap;

export const Fragment = "Fragment";

export const render = (fn: () => HTMLElement) => {
	if (typeof(fn)==='function') {
		return fn();
	}
	console.log('incorrect type for render',typeof(fn),fn);
}

export function useState(initialState) {
	console.log("UseState called", currentContext);
	if (currentContext.hooks[currentContext.count]) {
		return currentContext.hooks[currentContext.count++](currentContext);
	}

	let state = initialState;

	const hook = (context) => {
		const setState = (value) => {
			console.log("State change", state, value);
			console.log("Current context", context);

			state = value;

			const renderedElement = context.render(context);
			console.log("Rendered Element", renderedElement.innerHTML);
		};

		return [state, setState] as const;
	};

	currentContext.hooks.push(hook);

	return hook(currentContext);
}

let currentContext;

const ContextKey = '__context';

export function h(
	type: Component["type"],
	props: Component["props"],
	...children: Component["children"]
) {
	if (typeof type === "function") {
		// Custom component
		//

		const createCustomComponent = (instanceContext) => {
			const tempContext = currentContext;
			currentContext = { ...instanceContext, count: 0 }
			// currentContext.count = 0;
			const result = type({ ...props, children });
			if (currentContext.element) {
				console.log('replace', currentContext.element, result);
				currentContext.element.replaceWith(render(result));
			}
			currentContext.element = result;

			currentContext = tempContext;
			return result;
		};


		
		
		return ()=> {
			const elementContext = { render: createCustomComponent, count: 0, hooks: [], element: undefined };
			return render(createCustomComponent(elementContext));
		}
	}
	return () => {
		

		const ele = document.createElement(type);

		// Object.assign(ele, props);
		const { ref, style, className, dataset, ...attr } = props ?? {};
		if (typeof ref === "function") ref(ele);

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
				ele.addEventListener(
					key.toLowerCase().replace("on", ""),
					val as EventListenerOrEventListenerObject
				);
			} else if (val === false) {
				//
			} else {
				ele.setAttribute(key, val as string);
			}
		});

		console.log(children, ele);

		ele.append(
			...children
				.map((child) => {
					// console.log("Condition", typeof child?.nodeType === "number");
					if (typeof(child)==='function') {
						return render(child);
					}
					if (
						typeof child === "object" &&
						typeof child?.nodeType !== "number" &&
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

		return ele;
	}

}