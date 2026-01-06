'use client';

import React, { useState, useMemo } from 'react';

// 1. 데이터 정의 (팀 정보 및 로스터)
const TEAMS_DATA = [
  { id: "GEN", name: "GEN.G", group: "Baron", players: ["Kiin", "Canyon", "Chovy", "Ruler", "Duro"] },
  { id: "T1", name: "T1", group: "Baron", players: ["Doran", "Oner", "Faker", "Peyz", "Keria"] },
  { id: "NS", name: "Nongshim RedForce", group: "Baron", players: ["Kingen", "Sponge", "Scout", "Taeyoon", "Lehends", "Calix"] },
  { id: "DNS", name: "DN SOOPers", group: "Baron", players: ["Kingen", "Lucid", "Showmaker", "Smash", "Career"] },
  { id: "BRO", name: "HANJIN BRION", group: "Baron", players: ["Casting", "GIDEON", "Fisher", "Teddy", "Namgung", "Roamer"] },
  { id: "HLE", name: "Hanwha Life Esports", group: "Elder", players: ["Zeus", "Kanavi", "Zeka", "Gumayusi", "Delight"] },
  { id: "DK", name: "Dplus Kia", group: "Elder", players: ["Siwoo", "Lucid", "Showmaker", "Smash", "Career"] },
  { id: "KT", name: "Kt Rolster", group: "Elder", players: ["PerfecT", "Cuzz", "Bdd", "Aiming", "Ghost", "Pollu"] },
  { id: "BFX", name: "BNK FearX", group: "Elder", players: ["Clear", "Raptor", "VicLa", "Diable", "Kellin", "Daystar"] },
  { id: "DRX", name: "DRX", group: "Elder", players: ["Rich", "Vincenzo", "Ucal", "Jiwoo", "Andil", "Willer"] }
];

// 2. 경기 일정 데이터 (1~3주차)
const MATCHES_DATA = [
  { id: 1, week: 1, day: 1, team1: "KT", team2: "DNS", points: 1 },
  { id: 2, week: 1, day: 1, team1: "DK", team2: "BRO", points: 1 },
  { id: 3, week: 1, day: 2, team1: "GEN", team2: "DRX", points: 1 },
  { id: 4, week: 1, day: 2, team1: "BFX", team2: "NS", points: 1 },
  { id: 5, week: 1, day: 3, team1: "DNS", team2: "DK", points: 1 },
  { id: 6, week: 1, day: 3, team1: "HLE", team2: "T1", points: 1 },
  { id: 7, week: 1, day: 4, team1: "BRO", team2: "BFX", points: 1 },
  { id: 8, week: 1, day: 4, team1: "GEN", team2: "KT", points: 1 },
  { id: 9, week: 1, day: 5, team1: "NS", team2: "HLE", points: 1 },
  { id: 10, week: 1, day: 5, team1: "DRX", team2: "T1", points: 1 },
  { id: 11, week: 2, day: 1, team1: "DK", team2: "NS", points: 1 },
  { id: 12, week: 2, day: 1, team1: "BRO", team2: "HLE", points: 1 },
  { id: 13, week: 2, day: 2, team1: "BFX", team2: "GEN", points: 1 },
  { id: 14, week: 2, day: 3, team1: "KT", team2: "T1", points: 1 },
  { id: 15, week: 2, day: 3, team1: "NS", team2: "DRX", points: 1 },
  { id: 16, week: 2, day: 4, team1: "HLE", team2: "DNS", points: 1 },
  { id: 17, week: 2, day: 4, team1: "DK", team2: "GEN", points: 1 },
  { id: 18, week: 2, day: 5, team1: "T1", team2: "BFX", points: 1 },
  { id: 19, week: 2, day: 5, team1: "KT", team2: "BRO", points: 1 },
  // 3주차 슈퍼위크 (승점 2점)
  { id: 20, week: 3, day: 1, team1: "BRO", team2: "DRX", points: 2 },
  { id: 21, week: 3, day: 2, team1: "DNS", team2: "BFX", points: 2 },
  { id: 22, week: 3, day: 3, team1: "NS", team2: "KT", points: 2 },
  { id: 23, week: 3, day: 4, team1: "T1", team2: "DK", points: 2 },
  { id: 24, week: 3, day: 5, team1: "HLE", team2: "GEN", points: 2 }
];

export default function LckCupApp() {
  const [predictions, setPredictions] = useState<Record<number, string>>({});

  // 그룹별 데이터 분리
  const baronTeams = useMemo(() => TEAMS_DATA.filter(t => t.group === "Baron"), []);
  const elderTeams = useMemo(() => TEAMS_DATA.filter(t => t.group === "Elder"), []);

  // 그룹 승점 계산 로직
  const getGroupScore = (groupName: string) => {
    return MATCHES_DATA.reduce((total, match) => {
      const winnerId = predictions[match.id];
      if (!winnerId) return total;
      const winnerTeam = TEAMS_DATA.find(t => t.id === winnerId);
      return winnerTeam?.group === groupName ? total + match.points : total;
    }, 0);
  };

  const baronScore = getGroupScore("Baron");
  const elderScore = getGroupScore("Elder");

  // 팀 카드 렌더링 컴포넌트
  const TeamCard = ({ team, color }: { team: typeof TEAMS_DATA[0], color: string }) => (
    <div className="bg-[#161a2e] border-t-4 rounded-xl p-5 shadow-xl transition-transform hover:scale-[1.02]" style={{ borderTopColor: color }}>
      <div className="flex justify-between items-baseline mb-1">
        <h3 className="text-4xl font-black text-white">{team.id}</h3>
        <span className="text-lg font-bold text-gray-500">{team.group}</span>
      </div>
      <p className="text-xs text-gray-500 font-medium mb-4 uppercase tracking-wider">{team.name}</p>
      
      <div className={`grid ${team.players.length > 5 ? 'grid-cols-6' : 'grid-cols-5'} gap-1 text-center`}>
        {['TOP', 'JGL', 'MID', 'ADC', 'SUP', 'SUB'].map((role, idx) => {
          if (idx === 5 && team.players.length <= 5) return null;
          return (
            <div key={role} className="flex flex-col">
              <span className="text-[9px] text-gray-600 font-bold mb-1">{role}</span>
              <span className="text-[11px] text-gray-200 truncate font-medium">{team.players[idx]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0c14] text-white p-4 md:p-10 font-sans">
      {/* 상단 스코어 보드 */}
      <header className="max-w-6xl mx-auto mb-12">
        <h1 className="text-center text-2xl font-black mb-8 tracking-tighter text-gray-300">LCK CUP 2026 PREDICTION</h1>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-stretch">
          <div className="flex-1 bg-purple-900/20 border border-purple-500/50 rounded-2xl p-6 flex justify-between items-center">
            <div>
              <p className="text-purple-400 font-black text-sm">BARON GROUP</p>
              <p className="text-xs text-gray-500 mt-1">HLE, DK, KT, BFX, DRX</p>
            </div>
            <div className="text-4xl font-black text-purple-400">{baronScore}<span className="text-sm ml-1 text-gray-400">PT</span></div>
          </div>
          <div className="flex-1 bg-red-900/20 border border-red-500/50 rounded-2xl p-6 flex justify-between items-center">
            <div>
              <p className="text-red-400 font-black text-sm">ELDER GROUP</p>
              <p className="text-xs text-gray-500 mt-1">GEN, T1, NS, DNS, BRO</p>
            </div>
            <div className="text-4xl font-black text-red-400">{elderScore}<span className="text-sm ml-1 text-gray-400">PT</span></div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto space-y-12">
        {/* 바론 그룹 섹션 */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-purple-600"></div>
            <h2 className="text-xl font-black text-purple-500">BARON GROUP TEAMS</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {baronTeams.map(team => <TeamCard key={team.id} team={team} color="#7c3aed" />)}
          </div>
        </section>

        {/* 장로 그룹 섹션 */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-red-600"></div>
            <h2 className="text-xl font-black text-red-500">ELDER GROUP TEAMS</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {elderTeams.map(team => <TeamCard key={team.id} team={team} color="#dc2626" />)}
          </div>
        </section>

        {/* 승부 예측 섹션 */}
        <section className="pt-10 border-t border-gray-800">
          <h2 className="text-center text-2xl font-black mb-10 text-gray-400">MATCH PICK'EM</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {MATCHES_DATA.map((match) => (
              <div key={match.id} className="bg-[#111421] p-4 rounded-xl flex items-center justify-between border border-gray-800/50 group hover:border-blue-500/50 transition-colors">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 font-bold uppercase">W{match.week} D{match.day}</span>
                  <span className={`text-[10px] font-black ${match.points === 2 ? 'text-yellow-500' : 'text-blue-500'}`}>
                    {match.points === 2 ? 'SUPER WEEK' : 'BO3'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setPredictions(prev => ({...prev, [match.id]: match.team1}))}
                    className={`w-16 py-1.5 rounded-md text-xs font-black transition-all ${predictions[match.id] === match.team1 ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                  >
                    {match.team1}
                  </button>
                  <span className="text-[9px] font-bold text-gray-700 italic">VS</span>
                  <button 
                    onClick={() => setPredictions(prev => ({...prev, [match.id]: match.team2}))}
                    className={`w-16 py-1.5 rounded-md text-xs font-black transition-all ${predictions[match.id] === match.team2 ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(37,99,235,0.5)]' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                  >
                    {match.team2}
                  </button>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-gray-400">+{match.points}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="max-w-6xl mx-auto mt-20 text-center text-gray-600 text-[10px] pb-10 uppercase tracking-widest">
        LCK CUP 2026 Fan-made Prediction Tool | T1 Faker Contract until 2029
      </footer>
    </div>
  );
}
