/** @type {import('tailwindcss').Config} */
module.exports = {
  /**
   * Specify the files Tailwind should scan for classes
   */
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    /**
     * Extend or override the default Tailwind theme
     */
    extend: {},
  },
  /**
   * Add any custom Tailwind plugins
   */
  plugins: [],
}