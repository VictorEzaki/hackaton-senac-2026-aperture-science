import { Avatar } from './Avatar';
import { RFQCard } from './RFQCard';
import { Button } from './Button';
import { Send } from 'lucide-react';

export function Messages() {
  const conversations = [
    { name: 'Metal Tec Indústria', lastMessage: 'Cotação enviada', unread: true, online: true },
    { name: 'Plásticos Lima', lastMessage: 'Quando precisam da entrega?', unread: false, online: true },
    { name: 'Aço Certo', lastMessage: 'Obrigado pelo contato!', unread: false, online: false },
    { name: 'Ferromax', lastMessage: 'Temos em estoque', unread: true, online: false },
  ];

  const messages = [
    { sender: 'buyer', content: 'Boa tarde! Gostaria de uma cotação para parafusos M8 x 40mm.' },
    { sender: 'supplier', content: 'Olá! Sim, temos esse item disponível. Qual a quantidade necessária?' },
    { sender: 'buyer', content: 'Preciso de 5.000 unidades. Qual o prazo de entrega?' },
    { sender: 'supplier', content: 'Segue nossa cotação para análise:' },
  ];

  return (
    <div className="flex h-[calc(100vh-120px)] max-w-[1440px] mx-auto p-6 gap-6">
      {/* Conversation List */}
      <div className="w-[300px] bg-card rounded-xl border border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h2>Mensagens</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv, index) => (
            <div
              key={index}
              className={`p-4 border-b border-border hover:bg-muted cursor-pointer transition-colors ${
                index === 0 ? 'bg-muted' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar name={conv.name} size={40} />
                  {conv.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#0F6E56] rounded-full border-2 border-card"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm truncate">{conv.name}</h4>
                    {conv.unread && (
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat View */}
      <div className="flex-1 bg-card rounded-xl border border-border flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar name="Metal Tec Indústria" size={40} />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#0F6E56] rounded-full border-2 border-card"></div>
            </div>
            <div>
              <h3 className="text-base">Metal Tec Indústria</h3>
              <p className="text-sm text-[#0F6E56]">Online</p>
            </div>
          </div>
          <Button variant="primary">Nova cotação</Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-md px-4 py-2.5 rounded-xl ${
                  message.sender === 'buyer'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {/* RFQ Card in Chat */}
          <div className="flex justify-start">
            <RFQCard
              itemName="Parafuso M8 x 40mm Aço Inox"
              quantity={5000}
              unit="unidades"
              unitPrice={0.85}
              total={4250.0}
            />
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              className="flex-1 px-4 py-2.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <Button variant="primary" icon={<Send size={18} />}>
              Enviar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
