import { createHTMLElement } from '../../utils/createHTMLElement';
import { InterfaceContainerElement } from '../../components/types/types';

class ModalWindowRegistration {
  private handler = (e: Event): void => {
    const target = e.target as HTMLElement;
    const textReset = document.querySelector('.modal-body p') as HTMLElement;
    if (target.classList.contains('button-close') || target.closest('.close-button')) {
      const container = document.querySelector('.message_container') as HTMLElement;
      container.innerHTML = ``;
    }
    if (textReset?.textContent?.includes('Регистрация завершена')) {
      window.location.hash = `/account/`;
    }
    window.location.hash = `/account`;
  };

  public draw(message: string, color?: string): HTMLElement {
    const messageWindow = createHTMLElement('message', 'div');

    messageWindow.innerHTML = `
    <div id="myModal" class="modal fade">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <div type="button" class="button-icon button-close" data-dismiss="modal" aria-hidden="true">&times;</div>
      </div>
      <div class="modal-body">
        <p style="color: ${color};">${message}</p>
      </div>
      <div class="modal-footer">
        <div type="button" class="button close-button" data-dismiss="modal"><span>Close</span></div>
      </div>
    </div>
  </div>
</div>
    `;
    messageWindow.addEventListener('click', this.handler);

    return messageWindow;
  }
}

export default ModalWindowRegistration;
