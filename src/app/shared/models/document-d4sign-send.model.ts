
export class DocumentD4signSend {
  message: string;
  skip_email: string;
  workflow: string;

  constructor(data: Partial<DocumentD4signSend> = {}) {
    this.message = data.message;
    this.skip_email = data.skip_email ?? '0';
    this.workflow = data.workflow ?? '0';
  }
}

