/**
 * Bouwt in de browser een GLB-bestand (binaire glTF 2.0) van een logomat:
 * een platte balk op ware grootte, met het ontwerp als textuur op de bovenkant
 * en een effen kleur op de zijkanten en onderkant.
 *
 * Geen externe libraries nodig: het resultaat kan rechtstreeks als `src`
 * aan <model-viewer> gegeven worden (via een blob-URL).
 */

type Vec3 = [number, number, number]

export interface MatGlbOptions {
  /** Breedte in meter (links-rechts). */
  widthM: number
  /** Lengte in meter (voor-achter). */
  depthM: number
  /** Dikte in meter. */
  thicknessM: number
  /** PNG-bytes van het ontwerp, bovenkant van de afbeelding = achterkant van de mat. */
  texturePng: Uint8Array
  /** Kleur van de zijkanten en onderkant, als [r, g, b] tussen 0 en 1. */
  edgeColor: [number, number, number]
}

const FLOAT = 5126
const UNSIGNED_SHORT = 5123
const ARRAY_BUFFER = 34962
const ELEMENT_ARRAY_BUFFER = 34963

function sub(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
}

function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
}

/** Twee driehoeken voor een vierhoek, met de juiste draairichting voor de gegeven normaal. */
function quadIndices(corners: Vec3[], normal: Vec3, offset: number): number[] {
  const facing = dot(cross(sub(corners[1], corners[0]), sub(corners[2], corners[0])), normal)
  const local = facing >= 0 ? [0, 1, 2, 0, 2, 3] : [0, 2, 1, 0, 3, 2]
  return local.map((i) => i + offset)
}

function minMax(positions: number[]) {
  const min = [Infinity, Infinity, Infinity]
  const max = [-Infinity, -Infinity, -Infinity]
  for (let i = 0; i < positions.length; i += 3) {
    for (let k = 0; k < 3; k++) {
      min[k] = Math.min(min[k], positions[i + k])
      max[k] = Math.max(max[k], positions[i + k])
    }
  }
  return { min, max }
}

function pad4(length: number) {
  return (4 - (length % 4)) % 4
}

export function buildMatGlb({ widthM, depthM, thicknessM, texturePng, edgeColor }: MatGlbOptions): Blob {
  const w = widthM / 2
  const d = depthM / 2
  const t = thicknessM

  // --- Bovenkant (met textuur) ---
  const top: Vec3[] = [
    [-w, t, -d],
    [w, t, -d],
    [w, t, d],
    [-w, t, d],
  ]
  const topNormal: Vec3 = [0, 1, 0]
  const topPositions = top.flat()
  const topNormals = top.flatMap(() => topNormal)
  // glTF: UV (0,0) is linksboven in de afbeelding.
  const topUvs = [0, 0, 1, 0, 1, 1, 0, 1]
  const topIndices = quadIndices(top, topNormal, 0)

  // --- Zijkanten en onderkant (effen kleur) ---
  const faces: { corners: Vec3[]; normal: Vec3 }[] = [
    { normal: [1, 0, 0], corners: [[w, 0, -d], [w, 0, d], [w, t, d], [w, t, -d]] },
    { normal: [-1, 0, 0], corners: [[-w, 0, -d], [-w, t, -d], [-w, t, d], [-w, 0, d]] },
    { normal: [0, 0, 1], corners: [[-w, 0, d], [-w, t, d], [w, t, d], [w, 0, d]] },
    { normal: [0, 0, -1], corners: [[-w, 0, -d], [w, 0, -d], [w, t, -d], [-w, t, -d]] },
    { normal: [0, -1, 0], corners: [[-w, 0, -d], [-w, 0, d], [w, 0, d], [w, 0, -d]] },
  ]
  const edgePositions: number[] = []
  const edgeNormals: number[] = []
  const edgeIndices: number[] = []
  faces.forEach((face, i) => {
    edgePositions.push(...face.corners.flat())
    edgeNormals.push(...face.corners.flatMap(() => face.normal))
    edgeIndices.push(...quadIndices(face.corners, face.normal, i * 4))
  })

  // --- Binaire buffer samenstellen (elk stuk op 4 bytes uitgelijnd) ---
  const chunks: Uint8Array[] = []
  const bufferViews: Record<string, unknown>[] = []
  let byteOffset = 0

  const addView = (bytes: Uint8Array, target?: number) => {
    bufferViews.push({ buffer: 0, byteOffset, byteLength: bytes.byteLength, ...(target ? { target } : {}) })
    chunks.push(bytes)
    const padding = pad4(bytes.byteLength)
    if (padding) chunks.push(new Uint8Array(padding))
    byteOffset += bytes.byteLength + padding
    return bufferViews.length - 1
  }

  const f32 = (values: number[]) => new Uint8Array(new Float32Array(values).buffer)
  const u16 = (values: number[]) => new Uint8Array(new Uint16Array(values).buffer)

  const views = {
    topPos: addView(f32(topPositions), ARRAY_BUFFER),
    topNrm: addView(f32(topNormals), ARRAY_BUFFER),
    topUv: addView(f32(topUvs), ARRAY_BUFFER),
    topIdx: addView(u16(topIndices), ELEMENT_ARRAY_BUFFER),
    edgePos: addView(f32(edgePositions), ARRAY_BUFFER),
    edgeNrm: addView(f32(edgeNormals), ARRAY_BUFFER),
    edgeIdx: addView(u16(edgeIndices), ELEMENT_ARRAY_BUFFER),
    image: addView(texturePng),
  }

  const topBounds = minMax(topPositions)
  const edgeBounds = minMax(edgePositions)

  const accessors = [
    { bufferView: views.topPos, componentType: FLOAT, count: 4, type: "VEC3", ...topBounds },
    { bufferView: views.topNrm, componentType: FLOAT, count: 4, type: "VEC3" },
    { bufferView: views.topUv, componentType: FLOAT, count: 4, type: "VEC2" },
    { bufferView: views.topIdx, componentType: UNSIGNED_SHORT, count: topIndices.length, type: "SCALAR" },
    { bufferView: views.edgePos, componentType: FLOAT, count: edgePositions.length / 3, type: "VEC3", ...edgeBounds },
    { bufferView: views.edgeNrm, componentType: FLOAT, count: edgeNormals.length / 3, type: "VEC3" },
    { bufferView: views.edgeIdx, componentType: UNSIGNED_SHORT, count: edgeIndices.length, type: "SCALAR" },
  ]

  const gltf = {
    asset: { version: "2.0", generator: "Carpetz configurator" },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0, name: "Logomat" }],
    meshes: [
      {
        name: "Logomat",
        primitives: [
          { attributes: { POSITION: 0, NORMAL: 1, TEXCOORD_0: 2 }, indices: 3, material: 0 },
          { attributes: { POSITION: 4, NORMAL: 5 }, indices: 6, material: 1 },
        ],
      },
    ],
    materials: [
      {
        name: "Ontwerp",
        pbrMetallicRoughness: { baseColorTexture: { index: 0 }, metallicFactor: 0, roughnessFactor: 0.95 },
      },
      {
        name: "Rand",
        pbrMetallicRoughness: { baseColorFactor: [...edgeColor, 1], metallicFactor: 0, roughnessFactor: 0.9 },
      },
    ],
    textures: [{ source: 0, sampler: 0 }],
    // 9729 = LINEAR, 9987 = LINEAR_MIPMAP_LINEAR, 33071 = CLAMP_TO_EDGE
    samplers: [{ magFilter: 9729, minFilter: 9987, wrapS: 33071, wrapT: 33071 }],
    images: [{ bufferView: views.image, mimeType: "image/png" }],
    accessors,
    bufferViews,
    buffers: [{ byteLength: byteOffset }],
  }

  // --- GLB-container: header + JSON-chunk + BIN-chunk ---
  const jsonBytes = new TextEncoder().encode(JSON.stringify(gltf))
  const jsonPadding = pad4(jsonBytes.byteLength)
  const jsonChunkLength = jsonBytes.byteLength + jsonPadding
  const totalLength = 12 + 8 + jsonChunkLength + 8 + byteOffset

  const header = new DataView(new ArrayBuffer(12 + 8))
  header.setUint32(0, 0x46546c67, true) // "glTF"
  header.setUint32(4, 2, true)
  header.setUint32(8, totalLength, true)
  header.setUint32(12, jsonChunkLength, true)
  header.setUint32(16, 0x4e4f534a, true) // "JSON"

  const binHeader = new DataView(new ArrayBuffer(8))
  binHeader.setUint32(0, byteOffset, true)
  binHeader.setUint32(4, 0x004e4942, true) // "BIN"

  const spaces = new Uint8Array(jsonPadding).fill(0x20)

  return new Blob([header.buffer, jsonBytes, spaces, binHeader.buffer, ...chunks], { type: "model/gltf-binary" })
}
