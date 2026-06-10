import { useState, useRef, useEffect, createContext, useContext, useMemo, useCallback, memo, useReducer } from "react";
import { Link } from "react-router-dom";

// UserContext definition for useContext case study
const UserContext = createContext({ name: "Jane Doe", role: "Administrator" });

// useReducer definitions for useReducer case study
interface CounterState {
  count: number;
}
type CounterAction = { type: "increment" } | { type: "decrement" };

const counterInitialState: CounterState = { count: 0 };

function counterReducer(state: CounterState, action: CounterAction): CounterState {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      return state;
  }
}

interface FormState {
  name: string;
  email: string;
  age: number;
}
type FormAction =
  | { field: "name"; value: string }
  | { field: "email"; value: string }
  | { field: "age"; value: number }
  | { field: "reset"; value: null };

function formReducer(state: FormState, action: FormAction): FormState {
  if (action.field === "reset") {
    return { name: "", email: "", age: 0 };
  }
  return {
    ...state,
    [action.field]: action.value
  };
}

// ChildButton definition for useCallback case study
const ChildButton = memo(({ onClick, label }: { onClick: () => void; label: string }) => {
  const renderCount = useRef(0);
  renderCount.current += 1;
  return (
    <button
      onClick={onClick}
      className="w-full px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-bold transition-all active:scale-95 text-center cursor-pointer"
    >
      {label} (Child Renders: {renderCount.current})
    </button>
  );
});
ChildButton.displayName = "ChildButton";

const ContextConsumerChild = () => {
  const user = useContext(UserContext);
  return (
    <div className="p-3 bg-violet-500/10 rounded-xl border border-violet-500/20 text-center">
      <span className="block text-[9px] font-bold text-violet-400 uppercase tracking-wider">Consumer Output</span>
      <span className="text-xs font-extrabold text-white block mt-1">{user.name}</span>
      <span className="text-[9px] text-slate-400 block mt-0.5">{user.role}</span>
    </div>
  );
};
ContextConsumerChild.displayName = "ContextConsumerChild";

import {
  Atom,
  Code2,
  Sparkles,
  Compass,
  RefreshCw,
  Plus,
  Minus,
  Check,
  ArrowRight,
  GraduationCap,
  Info
} from "lucide-react";

function Home() {
  // JSX preview state
  const [jsxMode, setJsxMode] = useState<"jsx" | "js">("jsx");

  // Hooks playground states
  const [activeHook, setActiveHook] = useState<"state" | "effect" | "ref" | "context" | "memo" | "callback" | "reducer">("state");
  const [count, setCount] = useState<number>(0);
  const [effectLogs, setEffectLogs] = useState<string[]>([]);
  const [triggerEffect, setTriggerEffect] = useState<number>(0);
  const hookInputRef = useRef<HTMLInputElement>(null);

  // useContext playground states
  const [contextUser, setContextUser] = useState({ name: "Jane Doe", role: "Administrator" });

  // useMemo playground states
  const [memoItems, setMemoItems] = useState([
    { id: 1, name: "React Course", price: 49 },
    { id: 2, name: "NextJS Book", price: 29 },
  ]);
  const [unrelatedCount, setUnrelatedCount] = useState(0);
  const calcRunsRef = useRef(0);

  // Expensive calculation demo with useMemo
  const total = useMemo(() => {
    calcRunsRef.current += 1;
    return memoItems.reduce((sum, item) => sum + item.price, 0);
  }, [memoItems]);

  // useCallback playground states
  const [parentCount, setParentCount] = useState(0);
  const [useCallbackEnabled, setUseCallbackEnabled] = useState(true);

  const memoizedCallback = useCallback(() => {
    // Stable reference callback
  }, []);

  const normalCallback = () => {
    // Freshly created callback on every render
  };

  const activeCallback = useCallbackEnabled ? memoizedCallback : normalCallback;

  // useReducer playground states
  const [counterState, counterDispatch] = useReducer(counterReducer, counterInitialState);
  const [formState, formDispatch] = useReducer(formReducer, { name: "", email: "", age: 0 });
  const [reducerLogs, setReducerLogs] = useState<string[]>([]);
  const [reducerPlaygroundMode, setReducerPlaygroundMode] = useState<"counter" | "form">("counter");
  const [reducerSubTab, setReducerSubTab] = useState<"code" | "form" | "compare" | "interview">("code");

  const handleReducerDispatch = (action: CounterAction) => {
    const time = new Date().toLocaleTimeString();
    const prevCount = counterState.count;
    const nextCount = action.type === "increment" ? prevCount + 1 : prevCount - 1;
    setReducerLogs((prev) => [
      `[${time}] dispatch({ type: "${action.type}" }) ➔ reducer({ count: ${prevCount} }, { type: "${action.type}" }) ➔ new state: { count: ${nextCount} }`,
      ...prev.slice(0, 3)
    ]);
    counterDispatch(action);
  };

  const handleFormDispatch = (action: FormAction) => {
    const time = new Date().toLocaleTimeString();
    if (action.field === "reset") {
      setReducerLogs((prev) => [
        `[${time}] dispatch({ field: "reset", value: null }) ➔ new state: { name: "", email: "", age: 0 }`,
        ...prev.slice(0, 3)
      ]);
    } else {
      setReducerLogs((prev) => [
        `[${time}] dispatch({ field: "${action.field}", value: ${typeof action.value === "string" ? `"${action.value}"` : action.value} }) ➔ new state: { ...state, ${action.field}: ${typeof action.value === "string" ? `"${action.value}"` : action.value} }`,
        ...prev.slice(0, 3)
      ]);
    }
    formDispatch(action);
  };

  // Router simulation state
  const [simulatedPath, setSimulatedPath] = useState<string>("/");

  // Effect playground logic
  useEffect(() => {
    if (triggerEffect > 0) {
      const time = new Date().toLocaleTimeString();
      setEffectLogs((prev) => [
        `[${time}] useEffect triggered: count changed to ${count}`,
        ...prev.slice(0, 4)
      ]);
    }
  }, [triggerEffect]);

  const handleTriggerEffect = () => {
    setCount((c) => c + 1);
    setTriggerEffect((t) => t + 1);
  };

  const handleRefFocus = () => {
    if (hookInputRef.current) {
      hookInputRef.current.focus();
      hookInputRef.current.select();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <section className="relative text-center py-16 px-6 overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl translate-y-1/2"></div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium animate-pulse">
            <GraduationCap className="w-4 h-4" />
            <span>Interactive Learning Hub</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-200 to-blue-400">
            Master the Core of React
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
            Step into functional web development. Explore live sandbox simulations for components, JSX compile systems, lifecycle hooks, and routing models.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a
              href="#explore"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-violet-900/40 transition-all duration-300 hover:scale-105"
            >
              Start Exploring
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:border-slate-600"
            >
              Sign In
            </Link>
            <Link
              to="/form-to-file-upload"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:border-slate-600"
            >
              Form To File Upload
            </Link>
          </div>
        </div>
      </section>

      {/* Grid of Concept Cards */}
      <section id="explore" className="grid grid-cols-1 lg:grid-cols-2 gap-8 scroll-mt-24">

        {/* Card 1: React Core */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform duration-300">
                <Atom className="w-8 h-8 animate-[spin_20s_linear_infinite]" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                Foundations
              </span>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">React Overview</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm sm:text-base leading-relaxed">
              React is a component-based JavaScript library developed by Meta (created by Jordan Walke) to build rich, declarative interfaces through virtualized DOM updates.
            </p>

            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm tracking-wider uppercase">Architecture Features</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Virtual DOM matching</span>
                </li>
                <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Declarative layout UI</span>
                </li>
                <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Component architecture</span>
                </li>
                <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Unidirectional data flow</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6">
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-3">Core Pillars</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="block font-bold text-xs text-violet-600 dark:text-violet-400">01. Components</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Isolated, reusable UI building units.</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="block font-bold text-xs text-indigo-600 dark:text-indigo-400">02. Props</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Immutable read-only configurations.</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="block font-bold text-xs text-blue-600 dark:text-blue-400">03. State</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Local dynamic data variables.</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="block font-bold text-xs text-pink-600 dark:text-pink-400">04. Hooks</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">State access inside function blocks.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Typically used for:</span>
            <div className="flex flex-wrap gap-2">
              {["SPAs", "Admin Dashboards", "E-commerce Apps", "Social Networks", "React Native"].map((tag) => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Card 2: JSX Syntax Compiler */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform duration-300">
                <Code2 className="w-8 h-8" />
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 text-xs font-medium">
                <button
                  onClick={() => setJsxMode("jsx")}
                  className={`px-3 py-1 rounded-md transition-colors ${jsxMode === "jsx"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                >
                  JSX
                </button>
                <button
                  onClick={() => setJsxMode("js")}
                  className={`px-3 py-1 rounded-md transition-colors ${jsxMode === "js"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                >
                  Compiled JS
                </button>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">JSX (JavaScript XML)</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm sm:text-base leading-relaxed">
              JSX extends JavaScript to support HTML-like markup natively. Under the hood, compilers build standard JavaScript function calls representing elements.
            </p>

            {/* Mock Code Editor Frame */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/80 bg-slate-950 shadow-md font-mono text-xs text-slate-300">
              {/* Window header */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                </div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                  {jsxMode === "jsx" ? "welcome-banner.tsx" : "welcome-banner.js"}
                </span>
                <span className="w-4"></span>
              </div>

              {/* Code content */}
              <div className="p-5 overflow-x-auto min-h-[160px] flex items-center leading-relaxed">
                {jsxMode === "jsx" ? (
                  <pre className="text-left w-full">
                    <code>
                      <span className="text-indigo-400">const</span>{" "}
                      <span className="text-blue-400">Greeting</span> = ({"{"}{" "}
                      <span className="text-amber-400">name</span>{" "}
                      {"}"}) =&gt; {"{"}
                      {"\n"}  <span className="text-indigo-400">return</span> ({"\n"}    &lt;
                      <span className="text-pink-400">h1</span>{" "}
                      <span className="text-teal-400">className</span>=
                      <span className="text-emerald-400">"welcome"</span>&gt;{"\n"}      Hello,{" "}
                      {"{"}
                      <span className="text-amber-400">name</span>
                      {"}"}!{"\n"}    &lt;/
                      <span className="text-pink-400">h1</span>&gt;{"\n"}  );{"\n"}
                      {"}"};
                    </code>
                  </pre>
                ) : (
                  <pre className="text-left w-full">
                    <code>
                      <span className="text-slate-500">// Compiled code via JSX transformer</span>
                      {"\n"}
                      <span className="text-indigo-400">import</span>{" "}
                      {"{"} jsx <span className="text-indigo-400">as</span> _jsx {"}"}{" "}
                      <span className="text-indigo-400">from</span>{" "}
                      <span className="text-emerald-400">"react/jsx-runtime"</span>;{"\n"}
                      {"\n"}
                      <span className="text-indigo-400">const</span>{" "}
                      <span className="text-blue-400">Greeting</span> = ({"{"}{" "}
                      <span className="text-amber-400">name</span>{" "}
                      {"}"}) =&gt; {"{"}
                      {"\n"}  <span className="text-indigo-400">return</span>{" "}
                      <span className="text-blue-400">_jsx</span>(
                      <span className="text-emerald-400">"h1"</span>, {"{"}
                      {"\n"}    <span className="text-teal-400">className</span>:{" "}
                      <span className="text-emerald-400">"welcome"</span>,{"\n"}    <span className="text-teal-400">children</span>: [
                      <span className="text-emerald-400">"Hello, "</span>,{" "}
                      <span className="text-amber-400">name</span>,{" "}
                      <span className="text-emerald-400">"!"</span>]{"\n"}  {"}"});{"\n"}
                      {"}"};
                    </code>
                  </pre>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
            <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <p>
              JSX isn't strictly required to write React applications, but it offers high readability and allows the build system to carry out static compilation optimizations.
            </p>
          </div>
        </div>

        {/* Card 3: React Hooks Playground */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 lg:col-span-2 flex flex-col justify-between group">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">React Hooks Playground</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Added in v16.8 to support state in functional components</p>
                </div>
              </div>

              {/* Hook Selector tabs */}
              <div className="flex flex-wrap bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 text-xs font-semibold self-start sm:self-center gap-1">
                {(["state", "effect", "ref", "context", "memo", "callback", "reducer"] as const).map((hook) => (
                  <button
                    key={hook}
                    onClick={() => setActiveHook(hook)}
                    className={`px-4 py-2 rounded-md transition-colors capitalize ${activeHook === hook
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      }`}
                  >
                    use{hook}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm sm:text-base leading-relaxed">
              React Hooks are special functions introduced in React 16.8 that allow functional components to use React features such as state, lifecycle methods, context, and refs without writing class components.Hooks let you use state and other React features without writing class components. Take a look at these live micro-sandboxes.
            </p>

            {/* Sandbox Container */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 p-6 min-h-[220px]">

              {/* Sandbox controls / UI */}
              <div className="md:col-span-2 flex flex-col justify-center space-y-4">
                {activeHook === "state" && (
                  <div className="space-y-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">Interactive Counter</span>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setCount((c) => c - 1)}
                        className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-violet-500 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all hover:scale-105 active:scale-95"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-3xl font-extrabold text-slate-950 dark:text-white w-12 text-center">
                        {count}
                      </span>
                      <button
                        onClick={() => setCount((c) => c + 1)}
                        className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-violet-500 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all hover:scale-105 active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Modifies the React component dynamic state object directly.
                    </p>
                  </div>
                )}

                {activeHook === "effect" && (
                  <div className="space-y-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Side Effect Dispatcher</span>
                    <div>
                      <button
                        onClick={handleTriggerEffect}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-900/10 hover:scale-105 transition-transform"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Trigger Change
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Dispatches callback routines to synch state changes with external effects.
                      <br />
                      Used for side effects such as:
                      API calls,Timers,Event listeners,DOM updates
                    </p>
                  </div>
                )}

                {activeHook === "ref" && (
                  <div className="space-y-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-400">Direct DOM Pointer</span>
                    <div className="flex gap-2">
                      <input
                        ref={hookInputRef}
                        type="text"
                        defaultValue="Edit me!"
                        className="px-3 py-2 bg-white dark:bg-slate-850 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:border-pink-500 w-full"
                      />
                      <button
                        onClick={handleRefFocus}
                        className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-bold shrink-0 hover:scale-105 transition-transform"
                      >
                        Focus Input
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Maintains a persistent mutable reference to a physical DOM reference.
                      <br />
                      Used to:
                      Access DOM elements and Persist values without causing re-renders
                    </p>
                  </div>
                )}

                {activeHook === "context" && (
                  <div className="space-y-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">Context Provider</span>
                    <div className="space-y-2">
                      <div>
                        <label className="text-[9px] font-semibold text-slate-400 block mb-0.5">User Name</label>
                        <input
                          type="text"
                          value={contextUser.name}
                          onChange={(e) => setContextUser((prev) => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-1.5 bg-white dark:bg-slate-850 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-850 dark:text-slate-100 focus:outline-hidden focus:border-violet-500"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-semibold text-slate-400 block mb-0.5">Role</label>
                        <input
                          type="text"
                          value={contextUser.role}
                          onChange={(e) => setContextUser((prev) => ({ ...prev, role: e.target.value }))}
                          className="w-full px-3 py-1.5 bg-white dark:bg-slate-855 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-850 dark:text-slate-100 focus:outline-hidden focus:border-violet-500"
                        />
                      </div>
                    </div>
                    <div className="pt-1">
                      <UserContext.Provider value={contextUser}>
                        <ContextConsumerChild />
                      </UserContext.Provider>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Avoids prop drilling by allowing components to access shared data directly.
                    </p>
                  </div>
                )}

                {activeHook === "memo" && (
                  <div className="space-y-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Expensive Calculations</span>
                    <div className="space-y-2">
                      <div className="bg-slate-100 dark:bg-slate-800/40 p-2.5 rounded-xl space-y-1 border border-slate-200 dark:border-slate-800">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Items List:</span>
                        <div className="max-h-[60px] overflow-y-auto space-y-0.5">
                          {memoItems.map((item) => (
                            <div key={item.id} className="flex justify-between text-[11px] text-slate-750 dark:text-slate-355">
                              <span>{item.name}</span>
                              <span className="font-bold">${item.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const newId = memoItems.length + 1;
                            const names = ["Advanced React", "Tailwind Guide", "TypeScript Pro", "Vite Mastery"];
                            const randomName = names[Math.floor(Math.random() * names.length)];
                            const randomPrice = Math.floor(Math.random() * 80) + 20;
                            setMemoItems((prev) => [...prev, { id: newId, name: `${randomName} #${newId}`, price: randomPrice }]);
                          }}
                          className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
                        >
                          Add Item
                        </button>
                        <button
                          onClick={() => {
                            setMemoItems([{ id: 1, name: "React Course", price: 49 }, { id: 2, name: "NextJS Book", price: 29 }]);
                            calcRunsRef.current = 0;
                          }}
                          className="px-3 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          Reset
                        </button>
                      </div>
                      <div>
                        <button
                          onClick={() => setUnrelatedCount((c) => c + 1)}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 hover:border-indigo-500 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          Trigger Render (val: {unrelatedCount})
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Used to memoize expensive calculations.
                      <br />
                      React recalculates only when dependencies change.
                    </p>
                  </div>
                )}

                {activeHook === "callback" && (
                  <div className="space-y-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Function Memoization</span>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Use useCallback:</span>
                        <button
                          onClick={() => setUseCallbackEnabled((e) => !e)}
                          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-hidden ${useCallbackEnabled ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
                            }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ${useCallbackEnabled ? "translate-x-5" : "translate-x-0"
                              }`}
                          />
                        </button>
                      </div>

                      <button
                        onClick={() => setParentCount((c) => c + 1)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 hover:border-emerald-500 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Force Parent Render ({parentCount})
                      </button>

                      <div className="pt-1">
                        <ChildButton onClick={activeCallback} label="Callback Child" />
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Used to memoize functions.
                      <br />
                      Avoids child re-renders by preserving function reference.
                    </p>
                  </div>
                )}

                {activeHook === "reducer" && (
                  <div className="space-y-4 text-left">
                    <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">Complex State via Actions</span>

                    {/* Sandbox Mode Selector */}
                    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 text-[11px] font-semibold">
                      <button
                        onClick={() => setReducerPlaygroundMode("counter")}
                        className={`flex-1 py-1 rounded-md transition-all cursor-pointer ${reducerPlaygroundMode === "counter"
                          ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                          : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                          }`}
                      >
                        Counter
                      </button>
                      <button
                        onClick={() => setReducerPlaygroundMode("form")}
                        className={`flex-1 py-1 rounded-md transition-all cursor-pointer ${reducerPlaygroundMode === "form"
                          ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                          : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                          }`}
                      >
                        Profile Form
                      </button>
                    </div>

                    {reducerPlaygroundMode === "counter" ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 justify-center py-2">
                          <button
                            onClick={() => handleReducerDispatch({ type: "decrement" })}
                            className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-violet-500 bg-white dark:bg-slate-850 text-slate-700 dark:text-slate-200 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-3xl font-extrabold text-slate-950 dark:text-white w-12 text-center">
                            {counterState.count}
                          </span>
                          <button
                            onClick={() => handleReducerDispatch({ type: "increment" })}
                            className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-violet-500 bg-white dark:bg-slate-855 text-slate-700 dark:text-slate-200 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Dispatches discrete actions (<code className="text-violet-500 font-bold">increment</code> / <code className="text-violet-500 font-bold">decrement</code>) to the reducer.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <div>
                            <label className="text-[9px] font-semibold text-slate-400 block mb-0.5">Name</label>
                            <input
                              type="text"
                              value={formState.name}
                              onChange={(e) => handleFormDispatch({ field: "name", value: e.target.value })}
                              className="w-full px-3 py-1.5 bg-white dark:bg-slate-850 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-850 dark:text-slate-100 focus:outline-hidden focus:border-violet-500"
                              placeholder="Enter name"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-semibold text-slate-400 block mb-0.5">Email</label>
                            <input
                              type="email"
                              value={formState.email}
                              onChange={(e) => handleFormDispatch({ field: "email", value: e.target.value })}
                              className="w-full px-3 py-1.5 bg-white dark:bg-slate-850 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-850 dark:text-slate-100 focus:outline-hidden focus:border-violet-500"
                              placeholder="Enter email"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-semibold text-slate-400 block mb-0.5">Age</label>
                            <input
                              type="number"
                              value={formState.age || ""}
                              onChange={(e) => handleFormDispatch({ field: "age", value: parseInt(e.target.value) || 0 })}
                              className="w-full px-3 py-1.5 bg-white dark:bg-slate-850 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-850 dark:text-slate-100 focus:outline-hidden focus:border-violet-500"
                              placeholder="Enter age"
                            />
                          </div>
                          <button
                            onClick={() => handleFormDispatch({ field: "reset", value: null })}
                            className="w-full py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                          >
                            Reset Form
                          </button>
                        </div>
                        <div className="p-2.5 bg-slate-100 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-650 dark:text-slate-350">
                          <span className="block font-bold text-slate-500 uppercase tracking-wider text-[8px] mb-1">State Object</span>
                          {"{"} name: "{formState.name}", email: "{formState.email}", age: {formState.age} {"}"}
                        </div>
                      </div>
                    )}

                    {/* Mental Model Flowchart */}
                    <div className="bg-slate-100 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Mental Model</span>
                      <div className="flex items-center justify-between text-[8px] font-mono text-slate-500 dark:text-slate-400 gap-0.5">
                        <span className="px-1 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-855 rounded-sm font-bold text-violet-600 dark:text-violet-400">dispatch(action)</span>
                        <ArrowRight className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                        <span className="px-1 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-855 rounded-sm font-bold text-indigo-600 dark:text-indigo-400">reducer()</span>
                        <ArrowRight className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                        <span className="px-1 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-855 rounded-sm font-bold text-pink-600 dark:text-pink-400">new state</span>
                        <ArrowRight className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                        <span className="px-1 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-855 rounded-sm font-bold text-emerald-600 dark:text-emerald-400">UI re-render</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Code output and logs */}
              <div className="md:col-span-3 bg-slate-950 rounded-xl border border-slate-850 p-4 font-mono text-xs flex flex-col justify-between overflow-x-auto min-h-[140px]">
                {activeHook === "state" && (
                  <pre className="text-left text-slate-300">
                    <code>
                      <span className="text-indigo-400">import</span> {"{"} useState {"}"}{" "}
                      <span className="text-indigo-400">from</span>{" "}
                      <span className="text-emerald-400">"react"</span>;{"\n\n"}
                      <span className="text-indigo-400">const</span> [count, setCount] ={" "}
                      <span className="text-blue-400">useState</span>(<span className="text-amber-400">{count}</span>);{"\n\n"}
                      <span className="text-slate-500">// Renders count value: {count}</span>
                    </code>
                  </pre>
                )}

                {activeHook === "effect" && (
                  <div className="flex flex-col h-full justify-between space-y-3">
                    <pre className="text-left text-slate-300 leading-tight">
                      <code>
                        <span className="text-blue-400">useEffect</span>(() =&gt; {"{"}{"\n"}
                        {"  "}document.title = <span className="text-emerald-400">`Count: ${"{"}count{"}"}`</span>;{"\n"}
                        {"}"}, [count]);
                      </code>
                    </pre>
                    <div className="border-t border-slate-900 pt-2.5">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block mb-1">Effect Execution Logs</span>
                      <div className="space-y-1 max-h-[80px] overflow-y-auto">
                        {effectLogs.length === 0 ? (
                          <span className="text-slate-600 italic block">No effects dispatched yet. Click "Trigger Change"</span>
                        ) : (
                          effectLogs.map((log, i) => (
                            <span key={i} className="text-emerald-400 block text-[10px]">
                              {log}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeHook === "ref" && (
                  <pre className="text-left text-slate-300">
                    <code>
                      <span className="text-indigo-400">const</span> inputRef ={" "}
                      <span className="text-blue-400">useRef</span>&lt;
                      <span className="text-teal-400">HTMLInputElement</span>&gt;(<span className="text-indigo-400">null</span>);{"\n\n"}
                      <span className="text-slate-500">// Direct focus invoke handler</span>{"\n"}
                      <span className="text-indigo-400">const</span> focus = () =&gt; inputRef.current?.
                      <span className="text-blue-400">focus</span>();{"\n\n"}
                      &lt;<span className="text-pink-400">input</span> <span className="text-teal-400">ref</span>={"{"}inputRef{"}"} /&gt;
                    </code>
                  </pre>
                )}

                {activeHook === "context" && (
                  <pre className="text-left text-slate-300">
                    <code>
                      <span className="text-indigo-400">const</span> UserContext ={" "}
                      <span className="text-blue-400">createContext</span>(...);{"\n\n"}
                      <span className="text-slate-500">// Consume Context in child:</span>{"\n"}
                      <span className="text-indigo-400">const</span> user ={" "}
                      <span className="text-blue-400">useContext</span>(UserContext);{"\n\n"}
                      <span className="text-slate-500">// Result: user.name = "{contextUser.name}"</span>{"\n"}
                      <span className="text-slate-500">// user.role = "{contextUser.role}"</span>
                    </code>
                  </pre>
                )}

                {activeHook === "memo" && (
                  <div className="flex flex-col h-full justify-between space-y-3">
                    <pre className="text-left text-slate-300 leading-tight">
                      <code>
                        <span className="text-indigo-400">const</span> total ={" "}
                        <span className="text-blue-400">useMemo</span>(() =&gt; {"{"}{"\n"}
                        {"  "}<span className="text-indigo-400">return</span> items.
                        <span className="text-blue-400">reduce</span>((sum, item) =&gt; sum + item.price,{" "}
                        <span className="text-amber-400">0</span>);{"\n"}
                        {"}"}, [items]);
                      </code>
                    </pre>
                    <div className="border-t border-slate-900 pt-2 text-left">
                      <div className="grid grid-cols-2 gap-4 text-[10px]">
                        <div>
                          <span className="text-slate-500 block">Total Price:</span>
                          <span className="text-xs font-bold text-emerald-400">${total}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Calculation Runs:</span>
                          <span className="text-xs font-bold text-amber-400">{calcRunsRef.current}</span>
                        </div>
                      </div>
                      <p className="text-[9px] text-slate-500 mt-2 leading-tight">
                        Unrelated parent renders will not trigger recalculation.
                      </p>
                    </div>
                  </div>
                )}

                {activeHook === "callback" && (
                  <div className="flex flex-col h-full justify-between space-y-3">
                    <pre className="text-left text-slate-300 leading-tight">
                      <code>
                        <span className="text-indigo-400">const</span> handleClick ={" "}
                        <span className="text-blue-400">useCallback</span>(() =&gt; {"{"}{"\n"}
                        {"  "}console.<span className="text-blue-400">log</span>(
                        <span className="text-emerald-400">"Clicked"</span>);{"\n"}
                        {"}"}, []);
                      </code>
                    </pre>
                    <div className="border-t border-slate-900 pt-2 text-left">
                      <span className="text-[10px] text-slate-500 block mb-0.5">Callback Reference Status:</span>
                      <span className={`text-[11px] font-bold block ${useCallbackEnabled ? "text-emerald-400" : "text-rose-400"}`}>
                        {useCallbackEnabled ? "✓ Stable reference" : "✗ Recreated on every render"}
                      </span>
                      <p className="text-[9px] text-slate-500 mt-2 leading-tight">
                        Useful when passing callback functions to memoized children.
                      </p>
                    </div>
                  </div>
                )}

                {activeHook === "reducer" && (
                  <div className="flex flex-col h-full justify-between space-y-4">
                    {/* Sub-tab Navigation */}
                    <div className="flex flex-wrap border-b border-slate-900 pb-1.5 gap-2 text-[10px] uppercase font-bold tracking-wider text-left shrink-0">
                      <button
                        onClick={() => setReducerSubTab("code")}
                        className={`pb-1 cursor-pointer transition-colors ${reducerSubTab === "code" ? "text-violet-400 border-b border-violet-400" : "text-slate-500 hover:text-slate-300"}`}
                      >
                        Basic Code
                      </button>
                      <button
                        onClick={() => setReducerSubTab("form")}
                        className={`pb-1 cursor-pointer transition-colors ${reducerSubTab === "form" ? "text-violet-400 border-b border-violet-400" : "text-slate-500 hover:text-slate-300"}`}
                      >
                        Form Code
                      </button>
                      <button
                        onClick={() => setReducerSubTab("compare")}
                        className={`pb-1 cursor-pointer transition-colors ${reducerSubTab === "compare" ? "text-violet-400 border-b border-violet-400" : "text-slate-500 hover:text-slate-300"}`}
                      >
                        useState vs useReducer
                      </button>
                      <button
                        onClick={() => setReducerSubTab("interview")}
                        className={`pb-1 cursor-pointer transition-colors ${reducerSubTab === "interview" ? "text-violet-400 border-b border-violet-400" : "text-slate-500 hover:text-slate-300"}`}
                      >
                        Interview Prep
                      </button>
                    </div>

                    <div className="flex-1 min-h-[140px] overflow-y-auto text-left">
                      {reducerSubTab === "code" && (
                        <pre className="text-slate-300 leading-tight text-[11px]">
                          <code>
                            <span className="text-slate-500">// Syntax: const [state, dispatch] = useReducer(reducer, initialState);</span>{"\n\n"}
                            <span className="text-slate-500">// Step 1: Create a Reducer</span>{"\n"}
                            <span className="text-indigo-400">function</span> <span className="text-blue-400">reducer</span>(state, action) {"{"}{"\n"}
                            {"  "}<span className="text-indigo-400">switch</span> (action.type) {"{"}{"\n"}
                            {"    "}<span className="text-indigo-400">case</span> <span className="text-emerald-400">"increment"</span>:{"\n"}
                            {"      "}<span className="text-indigo-400">return</span> {"{"} count: state.count + <span className="text-amber-400">1</span> {"}"};{"\n"}
                            {"    "}<span className="text-indigo-400">case</span> <span className="text-emerald-400">"decrement"</span>:{"\n"}
                            {"      "}<span className="text-indigo-400">return</span> {"{"} count: state.count - <span className="text-amber-400">1</span> {"}"};{"\n"}
                            {"    "}<span className="text-indigo-400">default</span>:{"\n"}
                            {"      "}<span className="text-indigo-400">return</span> state;{"\n"}
                            {"  "}{"}"}{"\n"}
                            {"}"}{"\n\n"}
                            <span className="text-slate-500">// Step 2: Use useReducer in component</span>{"\n"}
                            <span className="text-indigo-400">const</span> [state, dispatch] = <span className="text-blue-400">useReducer</span>(reducer, {"{"} count: <span className="text-amber-400">0</span> {"}"});
                          </code>
                        </pre>
                      )}

                      {reducerSubTab === "form" && (
                        <pre className="text-slate-300 leading-tight text-[11px]">
                          <code>
                            <span className="text-slate-500">// Real-World Form Example</span>{"\n"}
                            <span className="text-indigo-400">function</span> <span className="text-blue-400">formReducer</span>(state, action) {"{"}{"\n"}
                            {"  "}<span className="text-indigo-400">return</span> {"{"}{"\n"}
                            {"    "}...state,{"\n"}
                            {"    "}[action.field]: action.value{"\n"}
                            {"  "}{"}"};{"\n"}
                            {"}"}{"\n\n"}
                            <span className="text-indigo-400">const</span> [form, dispatch] = <span className="text-blue-400">useReducer</span>(formReducer, {"{"} name: <span className="text-emerald-400">""</span>, email: <span className="text-emerald-400">""</span> {"}"});{"\n\n"}
                            <span className="text-slate-500">// Dispatch on onChange:</span>{"\n"}
                            &lt;<span className="text-pink-400">input</span>{"\n"}
                            {"  "}<span className="text-teal-400">value</span>={"{"}form.name{"}"}{"\n"}
                            {"  "}<span className="text-teal-400">onChange</span>={"{"}(e) =&gt;{"\n"}
                            {"    "}<span className="text-blue-400">dispatch</span>({"{"} field: <span className="text-emerald-400">"name"</span>, value: e.target.value {"}"}){"\n"}
                            {"  "}{"}"}{"\n"}
                            /&gt;
                          </code>
                        </pre>
                      )}

                      {reducerSubTab === "compare" && (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-slate-300 border-collapse text-[11px]">
                            <thead>
                              <tr className="border-b border-slate-900 text-slate-400 font-bold">
                                <th className="py-2 pr-4">Feature</th>
                                <th className="py-2 pr-4 text-center">useState</th>
                                <th className="py-2 text-center">useReducer</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-900/40">
                              <tr>
                                <td className="py-2 pr-4 text-slate-400">Simple state</td>
                                <td className="py-2 pr-4 text-center text-emerald-400">✅</td>
                                <td className="py-2 text-center text-emerald-400">✅</td>
                              </tr>
                              <tr>
                                <td className="py-2 pr-4 text-slate-400">Complex state</td>
                                <td className="py-2 pr-4 text-center text-rose-500">❌</td>
                                <td className="py-2 text-center text-emerald-400">✅</td>
                              </tr>
                              <tr>
                                <td className="py-2 pr-4 text-slate-400">Multiple related values</td>
                                <td className="py-2 pr-4 text-center text-rose-500">❌</td>
                                <td className="py-2 text-center text-emerald-400">✅</td>
                              </tr>
                              <tr>
                                <td className="py-2 pr-4 text-slate-400">State transition logic</td>
                                <td className="py-2 pr-4 text-center text-rose-500">❌</td>
                                <td className="py-2 text-center text-emerald-400">✅</td>
                              </tr>
                              <tr>
                                <td className="py-2 pr-4 text-slate-400">Redux-like pattern</td>
                                <td className="py-2 pr-4 text-center text-rose-500">❌</td>
                                <td className="py-2 text-center text-emerald-400">✅</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}

                      {reducerSubTab === "interview" && (
                        <div className="space-y-3 text-[11px] leading-relaxed text-slate-300 font-sans">
                          <div>
                            <span className="text-violet-400 font-bold block mb-1 text-[10px] uppercase tracking-wider font-mono">Interview Answer Summary</span>
                            <p className="text-slate-400">
                              <span className="font-bold text-slate-300">useReducer</span> is a React Hook used for managing complex state logic. It takes a reducer function and an initial state, and returns the current state along with a dispatch function. The dispatch function sends actions to the reducer, which determines how the state should change. It is particularly useful when state updates are complex, involve multiple actions, or depend on previous state values.
                            </p>
                          </div>
                          <div className="border-t border-slate-900 pt-2">
                            <span className="text-indigo-400 font-bold block mb-1 text-[10px] uppercase tracking-wider font-mono">Why use useReducer?</span>
                            <p className="text-slate-400">
                              As the application grows, managing many related states with separate <code className="text-slate-300 font-mono text-[10px]">useState</code> variables becomes harder to track. A single reducer can consolidate all updates in one centralized, predictable place.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Dispatch Logs */}
                    <div className="border-t border-slate-900 pt-2.5 text-left shrink-0">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block mb-1">Dispatch Action Logs</span>
                      <div className="space-y-1 max-h-[70px] overflow-y-auto font-mono text-[10px]">
                        {reducerLogs.length === 0 ? (
                          <span className="text-slate-600 italic block">No actions dispatched yet. Interact with the sandbox on the left!</span>
                        ) : (
                          reducerLogs.map((log, i) => (
                            <span key={i} className="text-violet-400 block break-words">
                              {log}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: React Router Simulator */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 lg:col-span-2 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                <Compass className="w-8 h-8" />
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                Client Routing
              </span>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">React Router Architecture</h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm sm:text-base leading-relaxed">
              React Router enables client-side routing within a Single Page Application (SPA). Pages change content without refreshing the document.
            </p>

            {/* Simulated browser dashboard */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-md">
              {/* Mock Browser Header */}
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <div className="flex gap-1.5 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                </div>
                {/* Simulated URL bar */}
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-lg px-3 py-1 flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 w-full overflow-hidden">
                  <span className="text-slate-300 dark:text-slate-600 shrink-0 font-medium">http://localhost:5173</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold shrink-0">{simulatedPath}</span>
                </div>
              </div>

              {/* Sandbox viewport */}
              <div className="p-6 bg-slate-50 dark:bg-slate-900/40 min-h-[160px] flex flex-col md:flex-row gap-6">
                {/* Menu controls */}
                <div className="md:w-1/3 flex flex-col gap-2 shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">Simulate Navigation</span>
                  <button
                    onClick={() => setSimulatedPath("/")}
                    className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${simulatedPath === "/"
                      ? "bg-violet-600 text-white shadow-xs"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-400"
                      }`}
                  >
                    / (Home Route)
                  </button>
                  <button
                    onClick={() => setSimulatedPath("/dashboard")}
                    className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${simulatedPath === "/dashboard"
                      ? "bg-violet-600 text-white shadow-xs"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-400"
                      }`}
                  >
                    /dashboard
                  </button>
                  <button
                    onClick={() => setSimulatedPath("/login")}
                    className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${simulatedPath === "/login"
                      ? "bg-violet-600 text-white shadow-xs"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-400"
                      }`}
                  >
                    /login
                  </button>
                </div>

                {/* Render screen */}
                <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 flex flex-col justify-center min-h-[120px] shadow-xs">
                  {simulatedPath === "/" && (
                    <div className="space-y-2 text-center md:text-left">
                      <span className="text-[10px] font-extrabold text-violet-600 dark:text-violet-400 uppercase tracking-widest">Home Component</span>
                      <h4 className="text-lg font-extrabold text-slate-850 dark:text-white">Welcome, Developer!</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        This component renders at the root page path `/`. It serves as the entryway to the tutorial.
                      </p>
                    </div>
                  )}

                  {simulatedPath === "/dashboard" && (
                    <div className="space-y-2 text-center md:text-left">
                      <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Dashboard Component</span>
                      <h4 className="text-lg font-extrabold text-slate-850 dark:text-white">User Statistics Summary</h4>
                      <div className="grid grid-cols-2 gap-2 pt-1.5">
                        <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg text-center">
                          <span className="block text-sm font-bold text-slate-800 dark:text-white">4 / 4</span>
                          <span className="text-[9px] text-slate-500">Modules Completed</span>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg text-center">
                          <span className="block text-sm font-bold text-slate-800 dark:text-white">100%</span>
                          <span className="text-[9px] text-slate-500">Practice Score</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {simulatedPath === "/login" && (
                    <div className="space-y-2 text-center md:text-left">
                      <span className="text-[10px] font-extrabold text-pink-600 dark:text-pink-400 uppercase tracking-widest">Login Component</span>
                      <h4 className="text-lg font-extrabold text-slate-850 dark:text-white">Authentication Gateway</h4>
                      <div className="space-y-1.5 pt-1 max-w-[200px] mx-auto md:mx-0">
                        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-sm"></div>
                        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-sm"></div>
                        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-3">Key Router API Terms</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-150 dark:border-slate-800">
                <code className="text-violet-600 dark:text-violet-400 font-bold block mb-1">&lt;Routes&gt;</code>
                <span className="text-slate-500 dark:text-slate-400 leading-normal">
                  Acts as the container wrapper mapping active URLs onto views.
                </span>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-150 dark:border-slate-800">
                <code className="text-indigo-600 dark:text-indigo-400 font-bold block mb-1">&lt;Route&gt;</code>
                <span className="text-slate-500 dark:text-slate-400 leading-normal">
                  Pairs a matching pathname path string with its target element.
                </span>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-150 dark:border-slate-800">
                <code className="text-pink-600 dark:text-pink-400 font-bold block mb-1">useNavigate()</code>
                <span className="text-slate-500 dark:text-slate-400 leading-normal">
                  Allows programmatic transitions through the router stack.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Outro section with links */}
      <section className="text-center py-10 border-t border-slate-100 dark:border-slate-800">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Want to test your setup?</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Access the simulated authorization panel to check validator actions, dynamic routes, and API responses.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-white text-sm font-semibold transition-all duration-300"
        >
          <span>Proceed to Login</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}

export default Home;