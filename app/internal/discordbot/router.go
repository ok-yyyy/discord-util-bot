package discordbot

import "github.com/disgoorg/disgo/handler"

// NewRouter はコマンドを処理するためのルーターを作成します。
func NewRouter(cmds []Command) *handler.Mux {
	router := handler.New()

	for _, cmd := range cmds {
		def := cmd.Definition()
		router.Command("/"+def.CommandName(), cmd.Handle)
	}

	return router
}
