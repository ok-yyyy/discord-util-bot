package discordbot

import (
	"github.com/disgoorg/disgo/bot"
	"github.com/disgoorg/disgo/discord"
	"github.com/disgoorg/disgo/handler"
)

type Command interface {
	// Definition は、コマンドの定義を返します。
	Definition() discord.ApplicationCommandCreate
	// Handle は、コマンドが実行されたときの処理を行います。
	Handle(e *handler.CommandEvent) error
}

// Definitions は、コマンドの定義のスライスを返します。
func Definitions(cmds []Command) []discord.ApplicationCommandCreate {
	defs := make([]discord.ApplicationCommandCreate, 0, len(cmds))
	for _, cmd := range cmds {
		defs = append(defs, cmd.Definition())
	}
	return defs
}

// RegisterGlobalCommands は、グローバルコマンドを登録します。
func RegisterGlobalCommands(client *bot.Client, cmds []Command) error {
	_, err := client.Rest.SetGlobalCommands(client.ApplicationID, Definitions(cmds))
	return err
}
