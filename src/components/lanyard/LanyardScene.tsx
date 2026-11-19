"use client";

/**
 * The hanging ID card. A strap made of three short rope joints hangs from a fixed
 * point; the card is attached to the last joint and can be grabbed, pulled and
 * released, after which gravity and damping bring it back to rest.
 *
 * Rendering: three.js (via @react-three/fiber). Physics: Rapier.
 */

import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Canvas,
  events as createEvents,
  extend,
  useFrame,
  type ThreeElement,
  type ThreeEvent,
} from "@react-three/fiber";
import { Environment, Lightformer, useGLTF, useTexture } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
  type RigidBodyProps,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";

extend({ MeshLineGeometry, MeshLineMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>;
  }
}

export type LanyardSettings = {
  /** Downward pull. Higher = snappier, heavier swing. */
  gravity: number;
  /** How far the camera sits from the card. Higher = smaller card. */
  cameraDistance: number;
  /** Length of the strap between its anchor and the clip, in scene units (the card is about 1.9 tall). */
  ropeLength: number;
  /** Height of the point the strap hangs from, in scene units above the centre of the canvas. */
  anchorY: number;
  /** 0–100; 50 is neutral. */
  lighting: number;
  /** Whether the card can be grabbed and thrown. */
  interactive: boolean;
  clipColor: string;
  cardColor: string;
  /** Image wrapped along the strap, or null for no visible strap (the card then hangs from its clip alone). */
  strapImage: string | null;
  frontImage: string;
  backImage: string;
  /** How the card images sit in their half of the card. */
  imageSizing: "fill" | "fit";
};

const MODEL = "/lanyard/card.glb";
const TEXTURE_SIZE = 1024;
/** Share of the texture height the printable card face takes up in the model's UV map. */
const FACE_HEIGHT = 0.757;
/** Where the card starts before it swings into place: out to the right of the anchor. */
const START: [number, number] = [1, 0];
/** Strap length the artwork's repeat count was tuned for. */
const REFERENCE_ROPE = 3;

useGLTF.preload(MODEL);

function placeImage(img: HTMLImageElement, sizing: "fill" | "fit", boxW: number, boxH: number) {
  const imageRatio = img.width / img.height;
  const boxRatio = boxW / boxH;
  const wide = imageRatio > boxRatio;
  if ((sizing === "fill") === wide) {
    const w = boxH * imageRatio;
    return { w, h: boxH, x: (boxW - w) / 2, y: 0 };
  }
  const h = boxW / imageRatio;
  return { w: boxW, h, x: 0, y: (boxH - h) / 2 };
}

/** Paints the front and back artwork side by side into one texture for the card model. */
function useCardTexture({ frontImage, backImage, cardColor, imageSizing }: LanyardSettings) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    let cancelled = false;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = TEXTURE_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = cardColor;
    ctx.fillRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);

    const load = (src: string) =>
      new Promise<HTMLImageElement | null>((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });

    Promise.all([load(frontImage), load(backImage)]).then((images) => {
      if (cancelled) return;
      const half = TEXTURE_SIZE / 2;
      images.forEach((img, i) => {
        if (!img) return;
        const offset = i * half; // front on the left half, back on the right
        const box = placeImage(img, imageSizing, half, TEXTURE_SIZE * FACE_HEIGHT);
        ctx.save();
        ctx.beginPath();
        ctx.rect(offset, 0, half, TEXTURE_SIZE);
        ctx.clip();
        ctx.drawImage(img, offset + box.x, box.y, box.w, box.h);
        ctx.restore();
      });
      const tex = new THREE.CanvasTexture(canvas);
      tex.flipY = false;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.anisotropy = 16;
      setTexture(tex);
    });

    return () => {
      cancelled = true;
    };
  }, [frontImage, backImage, cardColor, imageSizing]);

  useEffect(() => () => texture?.dispose(), [texture]);
  return texture;
}

type CardModel = {
  nodes: Record<"card" | "clip" | "clamp", THREE.Mesh>;
};

/** The printed strap: a ribbon drawn along the rope, textured with a repeating image. */
function Strap({
  ref,
  image,
  length,
  width,
  height,
}: {
  ref: React.Ref<THREE.Mesh<MeshLineGeometry>>;
  image: string;
  /** Strap length in scene units; decides how many times the artwork repeats along it. */
  length: number;
  width: number;
  height: number;
}) {
  const source = useTexture(image);
  // A private copy set to repeat along the strap.
  const texture = useMemo(() => {
    const copy = source.clone();
    copy.wrapS = copy.wrapT = THREE.RepeatWrapping;
    copy.anisotropy = 16;
    copy.needsUpdate = true;
    return copy;
  }, [source]);
  const ratio = useMemo(() => {
    const img = source.image as { width?: number; height?: number } | undefined;
    return img?.width && img?.height ? img.width / img.height : 1;
  }, [source]);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <mesh ref={ref}>
      <meshLineGeometry />
      <meshLineMaterial
        args={[{ resolution: new THREE.Vector2(1, 1) }]}
        color="#ffffff"
        depthTest={false}
        resolution={new THREE.Vector2(width, height)}
        useMap={1}
        map={texture}
        // The artwork repeats so that one copy ends exactly at the clip, whatever the strap length.
        repeat={new THREE.Vector2((-17 / ratio) * (length / REFERENCE_ROPE), 1)}
        lineWidth={1}
      />
    </mesh>
  );
}

function Band({
  settings,
  width,
  height,
  onDragChange,
}: {
  settings: LanyardSettings;
  width: number;
  height: number;
  onDragChange: (dragging: boolean) => void;
}) {
  const maxSpeed = 50;
  const minSpeed = 0;

  const band = useRef<THREE.Mesh<MeshLineGeometry>>(null);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<RapierRigidBody>(null!);
  const j2 = useRef<RapierRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);
  const smoothed = useRef(new Map<RapierRigidBody, THREE.Vector3>());

  const vec = useMemo(() => new THREE.Vector3(), []);
  const ang = useMemo(() => new THREE.Vector3(), []);
  const rot = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);

  // Heavy damping is what makes the card settle quickly instead of swinging forever.
  const segment: RigidBodyProps = {
    type: "dynamic",
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4,
  };

  const { nodes } = useGLTF(MODEL) as unknown as CardModel;
  const cardTexture = useCardTexture(settings);
  const [curve] = useState(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]);
    c.curveType = "chordal";
    return c;
  });
  const [dragged, setDragged] = useState<THREE.Vector3 | false>(false);

  // Three rope links of equal length, then the card on a ball joint.
  const link = settings.ropeLength / 3;
  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], link]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], link]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], link]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.5, 0],
  ]);

  useEffect(() => {
    onDragChange(Boolean(dragged));
  }, [dragged, onDragChange]);

  useFrame((state, delta) => {
    if (dragged && card.current) {
      // Follow the pointer on a plane at the card's depth.
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }

    if (!fixed.current || !j1.current || !j2.current || !j3.current || !card.current) return;

    // Smooth the two middle joints so the strap curve doesn't jitter.
    [j1, j2].forEach((ref) => {
      const body = ref.current;
      const t = body.translation();
      let lerped = smoothed.current.get(body);
      if (!lerped) {
        lerped = new THREE.Vector3(t.x, t.y, t.z);
        smoothed.current.set(body, lerped);
      }
      vec.set(t.x, t.y, t.z);
      const distance = Math.max(0.1, Math.min(1, lerped.distanceTo(vec)));
      lerped.lerp(vec, delta * (minSpeed + distance * (maxSpeed - minSpeed)));
    });

    curve.points[0].copy(j3.current.translation());
    curve.points[1].copy(smoothed.current.get(j2.current)!);
    curve.points[2].copy(smoothed.current.get(j1.current)!);
    curve.points[3].copy(fixed.current.translation());
    if (band.current && curve.points.every((p) => Number.isFinite(p.x + p.y + p.z))) {
      band.current.geometry.setPoints(curve.getPoints(32));
    }

    // Ease the card back to facing the viewer.
    ang.copy(card.current.angvel());
    rot.copy(card.current.rotation());
    card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
  });

  const [sx, sy] = [START[0] * link, START[1] * link];
  const interactive = settings.interactive;

  return (
    <>
      <group position={[0, settings.anchorY, 0]}>
        <RigidBody ref={fixed} {...segment} type="fixed" />
        <RigidBody position={[sx * 0.5, sy * 0.5, 0]} ref={j1} {...segment}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[sx, sy, 0]} ref={j2} {...segment}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[sx * 1.5, sy * 1.5, 0]} ref={j3} {...segment}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[sx * 2, sy * 2, 0]}
          ref={card}
          {...segment}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerUp={(e: ThreeEvent<PointerEvent>) => {
              if (!interactive) return;
              (e.target as Element).releasePointerCapture(e.pointerId);
              setDragged(false);
              e.stopPropagation();
            }}
            onPointerDown={(e: ThreeEvent<PointerEvent>) => {
              if (!interactive || !card.current) return;
              e.nativeEvent.preventDefault(); // don't start a text selection underneath
              (e.target as Element).setPointerCapture(e.pointerId);
              setDragged(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
              e.stopPropagation();
            }}
            onPointerMove={(e: ThreeEvent<PointerEvent>) => {
              if (interactive && dragged) e.stopPropagation();
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              {/* keyed so the material is rebuilt once the artwork texture is ready */}
              <meshPhysicalMaterial
                key={cardTexture ? "printed" : "blank"}
                color={cardTexture ? "#ffffff" : settings.cardColor}
                map={cardTexture}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry}>
              <meshPhysicalMaterial color={settings.clipColor} roughness={0.3} metalness={0.8} />
            </mesh>
            <mesh geometry={nodes.clamp.geometry}>
              <meshPhysicalMaterial color={settings.clipColor} roughness={0.3} metalness={0.8} />
            </mesh>
          </group>
        </RigidBody>
      </group>

      {settings.strapImage && <Strap ref={band} image={settings.strapImage} length={settings.ropeLength} width={width} height={height} />}
    </>
  );
}

export default function LanyardScene({ settings, active }: { settings: LanyardSettings; active: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const dragging = useRef(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const update = () => setSize({ width: el.offsetWidth, height: el.offsetHeight });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    update();
    return () => ro.disconnect();
  }, []);

  // On touch screens, stop the page from scrolling only while the card itself is being dragged.
  useEffect(() => {
    const onTouch = (e: TouchEvent) => {
      if (dragging.current) e.preventDefault();
    };
    document.addEventListener("touchstart", onTouch, { passive: false });
    document.addEventListener("touchmove", onTouch, { passive: false });
    return () => {
      document.removeEventListener("touchstart", onTouch);
      document.removeEventListener("touchmove", onTouch);
    };
  }, []);

  const onDragChange = (isDragging: boolean) => {
    dragging.current = isDragging;
    document.body.style.userSelect = isDragging ? "none" : "";
    document.body.style.webkitUserSelect = isDragging ? "none" : "";
  };

  const light = 1 + (settings.lighting - 50) / 50;
  const stripRotation: [number, number, number] = [0, 0, Math.PI / 3];

  return (
    <div ref={wrap} style={{ width: "100%", height: "100%", position: "relative" }}>
      <Canvas
        camera={{ position: [0, 0, settings.cameraDistance], fov: 20 }}
        gl={{ alpha: true }}
        dpr={[1, 2]}
        frameloop={active ? "always" : "never"}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0), 0)}
        style={{ width: size.width || "100%", height: size.height || "100%", pointerEvents: "none" }}
        // The canvas itself ignores the pointer so links underneath stay clickable;
        // pointer events are read from the page and aimed at the card by raycast.
        eventSource={typeof document !== "undefined" ? document.body : undefined}
        events={(store) => ({
          ...createEvents(store),
          compute: (event, state) => {
            const rect = state.gl.domElement.getBoundingClientRect();
            state.pointer.set(
              ((event.clientX - rect.left) / rect.width) * 2 - 1,
              -((event.clientY - rect.top) / rect.height) * 2 + 1,
            );
            state.raycaster.setFromCamera(state.pointer, state.camera);
          },
        })}
      >
        <ambientLight intensity={Math.PI * light} />
        <Physics gravity={[0, -settings.gravity, 0]} timeStep={1 / 60}>
          <Band settings={settings} width={size.width} height={size.height} onDragChange={onDragChange} />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={2 * light} color="white" position={[0, -1, 5]} rotation={stripRotation} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3 * light} color="white" position={[-1, -1, 1]} rotation={stripRotation} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3 * light} color="white" position={[1, 1, 1]} rotation={stripRotation} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10 * light} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}
