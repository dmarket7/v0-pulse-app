import { View, Image, Text, StyleSheet } from "react-native";

interface LogoProps {
  size?: "small" | "medium" | "large" | "xlarge";
  showText?: boolean;
  variant?: "light" | "dark";
}

export function Logo({ size = "medium", showText = true, variant = "light" }: LogoProps) {
  const logoSize = {
    small: 32,
    medium: 48,
    large: 80,
    xlarge: 200,
  };

  const textSize = {
    small: 16,
    medium: 20,
    large: 28,
    xlarge: 40,
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/craft-logo.png")}
        style={[styles.logo, { width: logoSize[size], height: logoSize[size] }]}
      />
      {showText && (
        <Text style={[styles.text, { fontSize: textSize[size], color: variant === "light" ? "#FFFFFF" : "#1F2937" }]}>
          Pulse
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    borderRadius: 8,
  },
  text: {
    fontWeight: "bold",
  },
});
