package ratatxt

// DeviceCmd issue send commands on connected devices.
type DeviceCmd interface {
	// Forward commands device to send an outgoing message.
	Forward(topic, msgID, targetAddr, text string) error

	// Ping sends a ping message for testing device connection to service.
	Ping(topic string) error

	// ActiveHandler callback triggers when device is connected and responded on ping.
	ActiveHandler(func(clientID string))
}
