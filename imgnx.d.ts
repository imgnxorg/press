export {};

declare global {
    namespace JSX {
        interface IntrinsicElements {
            imgnx: React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement>,
                HTMLElement
            >;
        }
    }
}
