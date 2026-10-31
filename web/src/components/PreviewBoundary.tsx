import { Component, type ReactNode } from 'react';
export class PreviewBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="preview-empty" role="alert">
        <h2>Podgląd jest niedostępny</h2>
        <p>
          Nie udało się wyświetlić dokumentu w tej przeglądarce. Gotowy plik PDF nadal możesz
          pobrać.
        </p>
      </div>
    ) : (
      this.props.children
    );
  }
}
