  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalHeader 
        title="Central de Mensagens"
        showSearch={true}
      />
      
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Mensagens</h1>
          <p className="text-gray-600">Comunique-se com oficinas e motoristas</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[70vh]">
          {/* Lista de contatos */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden md:col-span-1 border h-full flex flex-col">
            {/* Barra de busca */}
            <div className="p-3 border-b">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar contato..."
                  className="w-full rounded-lg pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0047CC] focus:border-transparent"
                  value={buscaContato}
                  onChange={(e) => setBuscaContato(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            {/* Lista de contatos */}
            <div className="flex-1 overflow-y-auto">
              {contatosFiltrados.length > 0 ? (
                <div className="divide-y">
                  {contatosFiltrados.map((contato) => (
                    <div
                      key={contato.id}
                      className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                        contatoAtivo === contato.id ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setContatoAtivo(contato.id)}
                    >
                      <div className="flex items-center">
                        <div className="relative mr-3">
                          {contato.avatar ? (
                            <img
                              src={contato.avatar}
                              alt={contato.nome}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                              {contato.tipo === 'oficina' ? (
                                <BuildingStorefrontIcon className="h-6 w-6 text-gray-500" />
                              ) : (
                                <UserCircleIcon className="h-6 w-6 text-gray-500" />
                              )}
                            </div>
                          )}
                          {contato.online && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <h3 className="font-medium text-gray-900 truncate">{contato.nome}</h3>
                            {contato.ultimaMensagem && (
                              <span className="text-xs text-gray-500">
                                {formatarHorario(contato.ultimaMensagem.dataHora)}
                              </span>
                            )}
                          </div>
                          {contato.ultimaMensagem && (
                            <p className={`text-sm truncate ${
                              contato.naoLidas > 0 ? 'font-medium text-gray-900' : 'text-gray-500'
                            }`}>
                              {contato.ultimaMensagem.texto}
                            </p>
                          )}
                        </div>
                        {contato.naoLidas > 0 && (
                          <span className="ml-2 bg-[#0047CC] text-white text-xs font-medium rounded-full h-5 min-w-[20px] flex items-center justify-center px-1">
                            {contato.naoLidas}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Nenhum contato encontrado</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Área de chat */}
          <div className="md:col-span-2 h-full">
            {contatoAtivo ? (
              <ChatComponent
                contato={contatos.find(c => c.id === contatoAtivo) as ContatoChat}
                mensagens={mensagens[contatoAtivo] || []}
                usuarioId="usuario-123"
                usuarioNome="João Silva"
                usuarioAvatar="https://randomuser.me/api/portraits/men/32.jpg"
                onEnviarMensagem={enviarMensagem}
                onDigitando={notificarDigitando}
                onVisualizarMensagem={marcarComoLida}
                className="h-full"
              />
            ) : (
              <div className="h-full flex items-center justify-center bg-white rounded-lg shadow-md">
                <div className="text-center p-6">
                  <div className="mx-auto w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <ChatBubbleLeftRightIcon className="h-10 w-10 text-[#0047CC]" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">Suas conversas</h3>
                  <p className="text-gray-600 mb-6 max-w-md">
                    Selecione um contato para iniciar uma conversa ou continuar uma conversa existente.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  ); 