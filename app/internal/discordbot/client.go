package discordbot

import (
	"github.com/disgoorg/disgo"
	"github.com/disgoorg/disgo/bot"
)

// NewClient は、Discordクライアントを作成します。
func NewClient(token string, listeners ...bot.EventListener) (*bot.Client, error) {
	return disgo.New(
		token,
		bot.WithDefaultGateway(),
		bot.WithEventListeners(listeners...),
	)
}
