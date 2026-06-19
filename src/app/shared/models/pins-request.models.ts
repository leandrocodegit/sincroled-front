export interface PinsRequest {
  pins: Pin[];
}

export interface Pin {
  document: string;
  email: string;
  page_width: number;
  page_height: number;
  page: number;
  position_x: number;
  position_y: number;
  type: number;
}
