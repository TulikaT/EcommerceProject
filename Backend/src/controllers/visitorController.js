import Visitor from "../models/Visitor.js";

export const trackVisitor = async (req, res) => {
  try {
    let visitor = await Visitor.findOne();

    if (!visitor) {
      visitor = new Visitor({ count: 1 });
    } else {
      visitor.count += 1;
    }

    await visitor.save();
    res.status(200).json({ message: "Visitor tracked", visitorCount: visitor.count });
  } catch (error) {
    console.error("Error tracking visitor:", error);
    res.status(500).json({ message: "Error tracking visitor" });
  }
};

export const getVisitorCount = async (req, res) => {
  try {
    const visitor = await Visitor.findOne();
    res.status(200).json({ visitorCount: visitor ? visitor.count : 0 });
  } catch (error) {
    console.error("Error fetching visitor count:", error);
    res.status(500).json({ message: "Error fetching visitor count" });
  }
};
