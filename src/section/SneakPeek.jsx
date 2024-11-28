import React from "react";

const SneakPeek = () => {
  const features1 = [
    { title: "Interactive Animations", description: "Engage users with seamless animations using libraries like Framer Motion and GSAP." },
    { title: "Progressive Web Apps", description: "Build apps that work offline and provide native app-like experiences." },
    { title: "State Management", description: "Explore Redux, Zustand, and Context API for handling complex states." },
  ];

  const features2 = [
    { title: "TailwindCSS Tricks", description: "Learn advanced utility-first CSS techniques to design faster." },
    { title: "Web Performance Optimization", description: "Improve page load times with lazy loading, image optimization, and code splitting." },
    { title: "Accessibility", description: "Ensure your applications are inclusive and comply with WCAG standards." },
  ];

  const features3 = [
    { title: "React Server Components", description: "Understand how server-rendered components can improve React apps." },
    { title: "Micro-Frontends", description: "Break down large applications into smaller, manageable frontend modules." },
    { title: "Component Libraries", description: "Create reusable components with Storybook and design systems like Material UI." },
  ];

  return (
    <section className="bg-white text-neutral-800 max-w-7xl mx-auto p-6 rounded-lg shadow-inner shadow-neutral-200 mt-8">
      <h3 className="text-xl font-bold mb-4">What’s Next in Frontend?</h3>
      <div className="grid grid-cols-12 gap-5">
        {/* Features Group 1 */}
        <ul className="space-y-4 col-span-12 sm:col-span-6 md:col-span-4">
          {features1.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className="min-w-4 w-4 min-h-4 h-4 bg-indigo-500 rounded-full mt-1 mr-3"></div>
              <div>
                <h4 className="font-semibold">{feature.title}</h4>
                <p className="text-sm">{feature.description}</p>
              </div>
            </li>
          ))}
        </ul>
        {/* Features Group 2 */}
        <ul className="space-y-4 col-span-12 sm:col-span-6 md:col-span-4">
          {features2.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className="min-w-4 w-4 min-h-4 h-4 bg-green-500 rounded-full mt-1 mr-3"></div>
              <div>
                <h4 className="font-semibold">{feature.title}</h4>
                <p className="text-sm">{feature.description}</p>
              </div>
            </li>
          ))}
        </ul>
        {/* Features Group 3 */}
        <ul className="space-y-4 col-span-12 sm:col-span-6 md:col-span-4">
          {features3.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className="min-w-4 w-4 min-h-4 h-4 bg-yellow-500 rounded-full mt-1 mr-3"></div>
              <div>
                <h4 className="font-semibold">{feature.title}</h4>
                <p className="text-sm">{feature.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default SneakPeek;
