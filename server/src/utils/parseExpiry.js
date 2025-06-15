function parseExpiry(str) {
    const match = str.match(/^(\d+)([dhm])$/i);
    if (!match) throw new Error("Invalid refreshTokenExpiry format");
  
    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();
  
    switch (unit) {
      case 'd': return value * 24 * 60 * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'm': return value * 60 * 1000;
      default: throw new Error("Unsupported time unit");
    }
  }
  module.exports= parseExpiry;