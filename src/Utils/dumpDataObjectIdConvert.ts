/**
 * Mutable
 */
export function dumpDataObjectIdConvert(data: object[]) {
  if (data === null) return;
  console.log(`🚀 ~ dumpDataObjectIdConvert ~ data:`, data);

  data.forEach((obj, i) => {
    for (const key of Object.keys(obj)) {
      const v = (obj as any)[key];

      if (["$oid", "$date"].includes(key)) {
        // console.log(`🚀 ~ data.forEach ~ key:`, key, v, obj);

        //
        (data as any)[i] = v;
      }

      if (typeof v !== "object" || v === null) {
        continue;
      }

      if (Array.isArray(v) && typeof v[0] === "object") {
        console.log(`🚀 ~ data.forEach ~ vArray.isArray:`, v);

        dumpDataObjectIdConvert(v);
      }

      if ("$oid" in v) {
        (obj as any)[key] = v["$oid"];
      } else if ("$date" in v) {
        (obj as any)[key] = v["$date"];
      }
    }
  });
}
