// import React, { FC, useEffect, useState } from "react";
// import { useInputStore } from "../hooks/useInputStore";
// import sodium from "libsodium-wrappers";
// import StrInput from "./StrInput";

// interface SecureInputProps {
//   placeholder?: string;
//   name?: string;
//   userPublicKey: string; // base64 public key derived from master password
// }

// const SecureInput: FC<SecureInputProps> = ({ placeholder = "Password", name, userPublicKey }) => {
//   const { setInputValue } = useInputStore();
//   const [plainValue, setPlainValue] = useState("");
//   const [ready, setReady] = useState(false);

//   useEffect(() => {
//     (async () => {
//       await sodium.ready;
//       setReady(true);
//     })();
//   }, []);

//   const handleChange = async (value: string) => {
//     setPlainValue(value);
//     if (!ready) return;

//     // convert base64 -> Uint8Array
//     const publicKey = sodium.from_base64(userPublicKey, sodium.base64_variants.ORIGINAL);

//     // encrypt password text using user's public key
//     const cipher = sodium.crypto_box_seal(value, publicKey);
//     const cipherBase64 = sodium.to_base64(cipher, sodium.base64_variants.ORIGINAL);

//     // store only encrypted text in Zustand store
//     setInputValue(name || "password", cipherBase64);
//   };

//   return <StrInput placeholder={placeholder} privacy value={plainValue} onChange={handleChange} />;
// };

// export default SecureInput;
