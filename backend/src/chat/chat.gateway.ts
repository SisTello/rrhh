import { WebSocketGateway } from '@nestjs/websockets';
import { RealtimeNamespace } from '../shared/realtime/realtime-events';

@WebSocketGateway({ namespace: RealtimeNamespace.chat })
export class ChatGateway {}
