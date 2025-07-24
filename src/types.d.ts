type ObjectTypeType = 'path' | 'textbox' | 'activeselection';

declare namespace JSX {
  interface IntrinsicElements {
    'kv-think-board': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        mode: string;
        'board-id': string;
      },
      HTMLElement
    >;
  }
}
