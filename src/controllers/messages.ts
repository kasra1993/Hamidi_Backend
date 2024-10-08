import { MessageModel } from "../db/messages";

export const sendMessage = async (req: any, res: any) => {
  const { content, subject, recipient, sender } = req.body;
  console.log(content, subject, recipient, sender);

  if (!content || !recipient || !subject || !sender) {
    return res
      .status(400)
      .json({ message: "Content, Subject and recipient are required." });
  }

  try {
    const message = new MessageModel({
      sender,
      recipient,
      content,
      subject,
    });
    await message.save();
    res
      .status(201)
      .json({ successMessage: "Response sent successfully", message });
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
};

// Function to fetch sent messages (user1)
export const getSentMessages = async (req: any, res: any) => {
  try {
    const messages = await MessageModel.find({ sender: req.user._id }).populate(
      "recipient",
      "name"
    );
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error });
  }
};

// Function to fetch received messages (user2)
export const getReceivedMessages = async (req: any, res: any) => {
  try {
    const messages = await MessageModel.find({
      recipient: req.user._id,
    }).populate("sender", "name");
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error });
  }
};

// Function to respond to a message (user2)
export const respondToMessage = async (req: any, res: any) => {
  const { id } = req.params;
  const { response } = req.body;

  if (!response) {
    return res.status(400).json({ message: "Response content is required." });
  }

  try {
    const message = await MessageModel.findById(id);

    if (!message || message.recipient.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized or message not found" });
    }

    message.response = response;
    message.responseTimestamp = new Date(Date.now());
    await message.save();

    res
      .status(200)
      .json({ successMessage: "Response sent successfully", message });
  } catch (error) {
    res.status(500).json({ message: "Error responding to message", error });
  }
};
