package app

import "github.com/caarlos0/env/v11"

type Config struct {
	BotToken string `env:"DISCORD_BOT_TOKEN,required"`
}

// NewConfig は、環境変数から設定を読み込みます。
func NewConfig() (Config, error) {
	var cfg Config
	if err := env.Parse(&cfg); err != nil {
		return Config{}, err
	}

	return cfg, nil
}
